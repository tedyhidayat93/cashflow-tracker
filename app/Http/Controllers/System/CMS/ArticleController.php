<?php

namespace App\Http\Controllers\BackPanel\CMS;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\User;
use App\Models\Tag;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use App\Traits\HandlesSeoImage;

class ArticleController extends Controller
{
    use HandlesSeoImage;

    public function __construct()
    {
        // Apply permission middleware to all methods
        $this->middleware('permission:article-list')->only(['index', 'show']);
        $this->middleware('permission:article-create')->only(['create', 'store']);
        $this->middleware('permission:article-edit')->only(['edit', 'update', 'toggleStatus', 'updatePosition']);
        $this->middleware('permission:article-delete')->only(['destroy']);
    }
    public function index(Request $request)
    {
        Gate::authorize('article-list');
        
        $articles = Article::when($request->search, function ($query, $search) {
                return $query->where('title', 'like', "%{$search}%")
                    ->orWhere('content', 'like', "%{$search}%")
                    ->orWhere('excerpt', 'like', "%{$search}%");
            })
            ->when($request->status, function ($query, $status) {
                if ($status === 'published') {
                    return $query->where('status', 'published');
                } elseif ($status === 'draft') {
                    return $query->where('status', 'draft');
                } elseif ($status === 'archived') {
                    return $query->where('status', 'archived');
                }
            })
            ->when($request->author, function ($query, $author) {
                return $query->where('author_id', $author);
            })
            ->when($request->headline, function ($query, $headline) {
                if ($headline === 'true') {
                    return $query->where('is_headline', true);
                } elseif ($headline === 'false') {
                    return $query->where('is_headline', false);
                }
            })
            ->when($request->category, function ($query, $category) {
                return $query->where('category_id', $category);
            })
            ->when($request->date_from, function ($query, $dateFrom) {
                return $query->whereDate('created_at', '>=', $dateFrom);
            })
            ->when($request->date_to, function ($query, $dateTo) {
                return $query->whereDate('created_at', '<=', $dateTo);
            })
            ->when($request->sort, function ($query, $sort) {
                if ($sort === 'newest') {
                    return $query->orderBy('created_at', 'desc');
                } elseif ($sort === 'oldest') {
                    return $query->orderBy('created_at', 'asc');
                } elseif ($sort === 'most_read') {
                    return $query->orderBy('views_count', 'desc');
                } elseif ($sort === 'least_read') {
                    return $query->orderBy('views_count', 'asc');
                }
            }, function ($query) {
                // Default sorting if no sort is specified
                return $query->orderBy('created_at', 'desc');
            })
            ->with(['author', 'category'])
            ->paginate($request->per_page ?? 15);

        $authors = User::orderBy('id', 'asc')->get();
        // dd($authors->toArray());
        $blogCategories = Category::with('children')
            ->root()
            ->active()
            ->ofType('blog')
            ->orderBy('name')
            ->get();

        return Inertia::render('backpanel/article/index', [
            'articles' => $articles,
            'authors' => $authors,
            'blogCategories' => $blogCategories,
            'filters' => $request->only(['search', 'status', 'author', 'headline', 'category', 'sort', 'per_page', 'page'])
        ]);
    }

    public function create()
    {
        Gate::authorize('article-create');
        
        $authors = User::orderBy('name')->get();
        $blogCategories = Category::with('children')
            ->root()
            ->active()
            ->ofType('blog')
            ->orderBy('name')
            ->get();

        return Inertia::render('backpanel/article/create', [
            'authors' => $authors,
            'blogCategories' => $blogCategories,
        ]);
    }

    public function store(Request $request)
    {
        Gate::authorize('article-create');
        
        // Handle tags and is_headline before validation
        $requestData = $request->all();
        
        // Convert tags to array if it's a string
        if (isset($requestData['tags']) && is_string($requestData['tags'])) {
            $decodedTags = json_decode($requestData['tags'], true);
            $requestData['tags'] = is_array($decodedTags) ? array_filter($decodedTags) : [];
        }
        
        // Convert is_headline to boolean
        if (isset($requestData['is_headline'])) {
            $requestData['is_headline'] = filter_var($requestData['is_headline'], FILTER_VALIDATE_BOOLEAN);
        }

        $validated = validator()->make($requestData, [
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:articles,slug',
            'content' => 'required|string',
            'excerpt' => 'nullable|string|max:500',
            'featured_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5048',
            'status' => 'required|string|in:draft,published,archived',
            'published_at' => 'nullable|date',
            'author_id' => 'required|integer|exists:users,id',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
            'meta_keywords' => 'nullable|string|max:255',
            'tags' => 'nullable|array',
            'tags.*' => 'nullable|string|max:50',
            'position' => 'nullable|integer|min:0',
            'is_headline' => 'nullable|boolean',
            'category_id' => 'nullable|integer|exists:categories,id',
        ], [
            'tags.array' => 'The tags field must be an array.',
            'is_headline.boolean' => 'The is headline field must be true or false.',
        ])->validate();

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        if (isset($validated['tags'])) {
            // If tags come as JSON string from frontend, decode it first
            if (is_string($validated['tags'])) {
                $decodedTags = json_decode($validated['tags'], true);
                $validated['tags'] = is_array($decodedTags) ? array_filter($decodedTags) : [];
            } else {
                // If tags come as array, filter empty values
                $validated['tags'] = array_filter($validated['tags']);
            }
            $this->insertNewTags($validated['tags'], 'article');
        }

        // Auto-generate position based on highest existing position
        $maxPosition = Article::max('position') ?? 0;
        $validated['position'] = $maxPosition + 1;
        $validated['is_headline'] = $validated['is_headline'] ?? false;
        // Set default category_id to first blog category if not provided
        if (!isset($validated['category_id']) || empty($validated['category_id'])) {
            $defaultCategory = Category::ofType('blog')->active()->first();
            $validated['category_id'] = $defaultCategory ? $defaultCategory->id : null;
        }

        if ($validated['status'] === 'published' && !isset($validated['published_at'])) {
            $validated['published_at'] = now();
        }

        // Handle featured image upload
        if ($request->hasFile('featured_image')) {
            $image = $request->file('featured_image');

            // $path = $image->store('articles', 'public');
            // $validated['featured_image'] = $path;

            $validated['featured_image'] =
            $this->optimizeSeoImage(
                file: $image,
                directory: 'articles',
                width: 1200,
                height: 630,
                quality: 82
            );
        }

        $article = Article::create($validated);

        return redirect()->route('cms.article.index')
            ->with('success', 'Artikel berhasil dibuat');
    }

    public function show($id)
    {
        Gate::authorize('article-list');
        
        $article = Article::with(['author'])->findOrFail($id);

        return Inertia::render('backpanel/article/show', [
            'article' => $article
        ]);
    }

    public function edit($id)
    {
        Gate::authorize('article-edit');
        
        $article = Article::findOrFail($id);
        $authors = User::orderBy('id', 'asc')->get();
        $blogCategories = Category::with('children')
            ->root()
            ->active()
            ->ofType('blog')
            ->orderBy('name')
            ->get();

        return Inertia::render('backpanel/article/edit', [
            'article' => $article,
            'authors' => $authors,
            'blogCategories' => $blogCategories,
        ]);
    }

    public function update(Request $request, $id)
    {
        Gate::authorize('article-edit');

        $article = Article::findOrFail($id);

        /*
        |--------------------------------------------------------------------------
        | PREPARE REQUEST
        |--------------------------------------------------------------------------
        */

        $requestData = $request->all();

        // Normalize tags
        if (
            $request->filled('tags') &&
            is_string($request->tags)
        ) {
            $request->merge([
                'tags' => json_decode(
                    $request->tags,
                    true
                ) ?? [],
            ]);
        }

        // Normalize boolean
        $request->merge([
            'is_headline' => $request->boolean('is_headline'),
        ]);

        /*
        |--------------------------------------------------------------------------
        | VALIDATION
        |--------------------------------------------------------------------------
        */

        $validated = validator(
            $requestData,
            [
                'title' => [
                    'required',
                    'string',
                    'max:255',
                ],

                'slug' => [
                    'nullable',
                    'string',
                    'max:255',
                    // Rule::unique('articles')
                    //     ->ignore($article->id),
                ],

                'content' => [
                    'required',
                    'string',
                ],

                'excerpt' => [
                    'nullable',
                    'string',
                    'max:500',
                ],

                'status' => [
                    'required',
                    'in:draft,published,archived',
                ],

                'published_at' => [
                    'nullable',
                    'date',
                ],

                'author_id' => [
                    'required',
                    'exists:users,id',
                ],

                'meta_title' => [
                    'nullable',
                    'string',
                    'max:255',
                ],

                'meta_description' => [
                    'nullable',
                    'string',
                    'max:500',
                ],

                'meta_keywords' => [
                    'nullable',
                    'string',
                    'max:255',
                ],

                'tags' => [
                    'nullable',
                    'array',
                ],

                'tags.*' => [
                    'string',
                    'max:50',
                ],

                'position' => [
                    'nullable',
                    'integer',
                    'min:0',
                ],

                'is_headline' => [
                    'boolean',
                ],

                'category_id' => [
                    'nullable',
                    'exists:categories,id',
                ],

                'featured_image' => [
                    'nullable',
                    'image',
                    'mimes:jpg,jpeg,png,gif',
                    'max:15048',
                ],

                'remove_featured_image' => [
                    'nullable',
                    'boolean',
                ],
            ],
            [
                'tags.array' =>
                    'Tags harus berupa array.',

                'is_headline.boolean' =>
                    'Is headline harus berupa boolean.',
            ]
        )->validate();

        // dd($validated);

        /*
        |--------------------------------------------------------------------------
        | SLUG
        |--------------------------------------------------------------------------
        */

        $validated['slug'] = filled($validated['slug'] ?? null)
            ? $validated['slug']
            : Str::slug($validated['title']);

        /*
        |--------------------------------------------------------------------------
        | TAGS
        |--------------------------------------------------------------------------
        */

        $validated['tags'] = collect(
            $validated['tags'] ?? []
        )
            ->filter()
            ->values()
            ->toArray();

        if (!empty($validated['tags'])) {
            $this->insertNewTags(
                $validated['tags'],
                'article'
            );
        }

        /*
        |--------------------------------------------------------------------------
        | PUBLISHED AT
        |--------------------------------------------------------------------------
        */

        if (
            $validated['status'] === 'published' &&
            empty($validated['published_at'])
        ) {
            $validated['published_at'] = now();
        }

        /*
        |--------------------------------------------------------------------------
        | FEATURED IMAGE REMOVE
        |--------------------------------------------------------------------------
        */

        if (
            $request->boolean('remove_featured_image') &&
            $article->featured_image
        ) {
            Storage::disk('public')
                ->delete($article->featured_image);

            $validated['featured_image'] = null;
        }

        /*
        |--------------------------------------------------------------------------
        | FEATURED IMAGE UPLOAD
        |--------------------------------------------------------------------------
        */

        if ($request->hasFile('featured_image')) {

            // Delete old image
            if ($article->featured_image) {
                Storage::disk('public')
                    ->delete($article->featured_image);
            }

            // $validated['featured_image'] =
            //     $request
            //         ->file('featured_image')
            //         ->store('articles', 'public');

            $image = $request->file('featured_image');
            $validated['featured_image'] =
            $this->optimizeSeoImage(
                file: $image,
                directory: 'articles',
                width: 1200,
                height: 630,
                quality: 82
            );
        }
        

        /*
        |--------------------------------------------------------------------------
        | UPDATE ARTICLE
        |--------------------------------------------------------------------------
        */

        $article->update($validated);

        /*
        |--------------------------------------------------------------------------
        | RESPONSE
        |--------------------------------------------------------------------------
        */

        return redirect()
            ->route('cms.article.index')
            ->with(
                'success',
                'Artikel berhasil diperbarui'
            );
    }

    public function destroy($id)
    {
        Gate::authorize('article-delete');
        
        $article = Article::findOrFail($id);

        // Delete featured image if exists
        if ($article->featured_image && file_exists(public_path($article->featured_image))) {
            unlink(public_path($article->featured_image));
        }

        $article->delete();

        return redirect()->route('cms.article.index')
            ->with('success', 'Artikel berhasil dihapus');
    }

    public function toggleStatus($id)
    {
        Gate::authorize('article-edit');
        
        $article = Article::findOrFail($id);
        
        if ($article->status === 'published') {
            $article->status = 'draft';
        } elseif ($article->status === 'draft') {
            $article->status = 'published';
            if (!$article->published_at) {
                $article->published_at = now();
            }
        } elseif ($article->status === 'archived') {
            $article->status = 'draft';
        }
        
        $article->save();

        return redirect()->route('cms.article.index')
            ->with('success', 'Status artikel berhasil diperbarui');
    }

    public function updatePosition(Request $request)
    {
        Gate::authorize('article-edit');
        
        $validated = $request->validate([
            'articles' => 'required|array',
            'articles.*.id' => 'required|integer|exists:articles,id',
            'articles.*.position' => 'required|integer|min:0',
        ]);

        foreach ($validated['articles'] as $articleData) {
            Article::where('id', $articleData['id'])
                ->update(['position' => $articleData['position']]);
        }

        return redirect()->route('cms.article.index')
            ->with('success', 'Posisi artikel berhasil diperbarui');
    }

    /**
     * Insert new tags into the tags table
     *
     * @param array $tags
     * @param string $type
     * @return void
     */
    private function insertNewTags(array $tags, string $type)
    {
        foreach ($tags as $tagName) {
            $tagName = trim($tagName);
            if (!empty($tagName)) {
                $slug = Str::slug($tagName);
                
                // Check if tag already exists
                $existingTag = Tag::where('slug', $slug)
                    ->orWhere('name', $tagName)
                    ->first();
                
                // Insert only if tag doesn't exist
                if (!$existingTag) {
                    Tag::create([
                        'name' => $tagName,
                        'slug' => $slug,
                        'type' => $type,
                    ]);
                }
            }
        }
    }
}