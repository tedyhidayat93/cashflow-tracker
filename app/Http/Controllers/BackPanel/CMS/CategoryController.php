<?php

namespace App\Http\Controllers\BackPanel\CMS;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function __construct()
    {
        // Apply permission middleware to all methods
        $this->middleware('permission:category-list')->only(['index', 'show']);
        $this->middleware('permission:category-create')->only(['create', 'store']);
        $this->middleware('permission:category-edit')->only(['edit', 'update', 'toggleStatus']);
        $this->middleware('permission:category-delete')->only(['destroy']);
    }
    public function index(Request $request)
    {
        Gate::authorize('category-list');
        
        $query = Category::query()
            ->with(['parent']);

        // 🔍 FILTER GLOBAL (semua data, bukan cuma root)
        if ($request->type && $request->type !== 'all') {
            $query->where('type', $request->type);
        }

        $allCategories = $query->orderBy('name')->get();
        
        // 🔍 HANDLE SEARCH (advanced)
        if ($request->search) {
            $allCategories = $this->filterWithAncestors($allCategories, $request->search);
        }

        // 🌲 BUILD TREE MANUAL
        $tree = $this->buildTree($allCategories);

        return Inertia::render('backpanel/category/index', [
            'categories' => $tree,
            'filters' => $request->only(['search', 'type'])
        ]);
    }

    private function filterWithAncestors($categories, $search)
    {
        $matched = $categories->filter(function ($item) use ($search) {
            return str_contains(strtolower($item->name), strtolower($search)) ||
                str_contains(strtolower($item->description ?? ''), strtolower($search));
        });

        $result = collect();

        foreach ($matched as $item) {
            $result->push($item);

            // 🔥 ambil semua parent ke atas
            $parentId = $item->parent_id;

            while ($parentId) {
                $parent = $categories->firstWhere('id', $parentId);
                if (!$parent) break;

                $result->push($parent);
                $parentId = $parent->parent_id;
            }
        }

        return $result->unique('id')->values();
    }

    private function buildTree($categories, $parentId = null)
    {
        return $categories
            ->where('parent_id', $parentId)
            ->map(function ($category) use ($categories) {
                $category->children = $this->buildTree($categories, $category->id);
                return $category;
            })
            ->values();
    }

    public function show($id)
    {
        Gate::authorize('category-list');
        
        $category = Category::with('parent', 'children')->findOrFail($id);

        return Inertia::render('backpanel/category/show', [
            'category' => $category
        ]);
    }

    public function create()
    {
        Gate::authorize('category-create');
        
        $parentCategories = Category::with('children')
            ->root()
            ->active()
            ->orderBy('lft')
            ->get();

        return Inertia::render('backpanel/category/create', [
            'parentCategories' => $parentCategories
        ]);
    }

    public function edit($id)
    {
        Gate::authorize('category-edit');
        
        $category = Category::with('parent', 'children')->findOrFail($id);
        $parentCategories = Category::with('children')
            ->root()
            ->active()
            ->orderBy('lft')
            ->get();

        return Inertia::render('backpanel/category/edit', [
            'category' => $category,
            'parentCategories' => $parentCategories
        ]);
    }

    public function store(Request $request)
    {
        Gate::authorize('category-create');
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:categories,slug',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'type' => 'required|string|in:product,service,blog',
            'parent_id' => 'nullable|exists:categories,id',
            'is_active' => 'boolean',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $path = $image->store('categories', 'public');
            $validated['image'] = $path;
        }

        $validated['is_active'] = $validated['is_active'] ?? true;

        $category = Category::create($validated);

        return redirect()->route('cms.category.index')
            ->with('success', 'Kategori berhasil dibuat');
    }

    public function update(Request $request, $id)
    {
        Gate::authorize('category-edit');
        
        $category = Category::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('categories')->ignore($category->id),
            ],
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'type' => 'required|string|in:product,service,blog',
            'parent_id' => 'nullable|exists:categories,id',
            'is_active' => 'sometimes|boolean',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        if ($request->hasFile('image')) {
            if ($category->image) {
                Storage::disk('public')->delete($category->image);
            }
            $image = $request->file('image');
            $path = $image->store('categories', 'public');
            $validated['image'] = $path;
        }

        // Handle is_active field properly
        $validated['is_active'] = isset($validated['is_active']) 
            ? (bool) $validated['is_active'] 
            : $category->is_active;

        $category->update($validated);

        return redirect()->route('cms.category.index')
            ->with('success', 'Kategori berhasil diperbarui');
    }

    public function destroy($id)
    {
        Gate::authorize('category-delete');
        
        $category = Category::findOrFail($id);

        if ($category->children()->count() > 0) {
            return redirect()->route('cms.category.index')
            ->with('error', 'Tidak dapat menghapus kategori yang memiliki subkategori');
        }

        if ($category->image) {
            Storage::disk('public')->delete($category->image);
        }

        $category->delete();

        return redirect()->route('cms.category.index')
            ->with('success', 'Kategori berhasil dihapus');
    }

    public function toggleStatus($id)
    {
        Gate::authorize('category-edit');
        
        $category = Category::findOrFail($id);
        $category->is_active = !$category->is_active;
        $category->save();

        return redirect()->route('cms.category.index')
            ->with('success', 'Status kategori berhasil diperbarui');
    }
}