<?php

namespace App\Http\Controllers\BackPanel\CMS;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use App\Traits\HandlesSeoImage;

class ProductController extends Controller
{

    use HandlesSeoImage;

    public function __construct()
    {
        $this->middleware('permission:product-list')
            ->only(['index', 'show']);

        $this->middleware('permission:product-create')
            ->only(['create', 'store']);

        $this->middleware('permission:product-edit')
            ->only([
                'edit',
                'update',
                'toggleStatus',
                'toggleFeatured',
                'toggleBestseller',
                'updatePosition',
            ]);

        $this->middleware('permission:product-delete')
            ->only(['destroy']);
    }

    public function index(Request $request)
    {
        Gate::authorize('product-list');

        $products = Product::query()
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%")
                        ->orWhere('sku', 'like', "%{$search}%");
                });
            })

            ->when($request->type_sell, function ($query, $type) {
                match ($type) {
                    'sell' => $query
                        ->where('is_for_sell', true)
                        ->where('is_rent', false),

                    'rent' => $query
                        ->where('is_rent', true)
                        ->where('is_for_sell', false),

                    'rent-and-sell' => $query
                        ->where('is_for_sell', true)
                        ->where('is_rent', true),

                    default => null,
                };
            })

            ->when($request->brand && $request->brand !== 'all', function ($query) use ($request) {
                $query->where('brand_id', $request->brand);
            })

            ->when($request->type && $request->type !== 'all', function ($query) use ($request) {
                $query->where('type', $request->type);
            })

            ->when($request->category && $request->category !== 'all', function ($query) use ($request) {
                $query->where('category_id', $request->category);
            })

            ->when($request->status && $request->status !== 'all', function ($query) use ($request) {
                $query->where('status', $request->status);
            })

            ->when($request->date_from, function ($query, $dateFrom) {
                $query->whereDate('created_at', '>=', $dateFrom);
            })

            ->when($request->date_to, function ($query, $dateTo) {
                $query->whereDate('created_at', '<=', $dateTo);
            })

            ->with([
                'brand',
                'category',
                'coverImage',
            ])

            ->orderBy('is_featured', 'desc')
            ->orderBy(...$this->getSort($request->sort))

            ->paginate($request->integer('per_page', 10))
            ->withQueryString();

        $products->getCollection()->transform(function ($product) {
            $product->image_path = $this->getProductImagePath(
                $product->coverImage?->image_path
            );

            return $product;
        });

        return Inertia::render('backpanel/product/index', [
            'products' => $products,

            'brands' => Brand::orderBy('name')->get(),

            'categories' => Category::ofType('product')
                ->orderBy('name')
                ->get(),

            'filters' => [
                'search' => $request->search ?? '',
                'type_sell' => $request->type_sell ?? 'all',
                'brand' => $request->brand ?? 'all',
                'type' => $request->type ?? 'all',
                'category' => $request->category ?? 'all',
                'status' => $request->status ?? 'all',
                'featured' => $request->featured ?? 'all',
                'bestseller' => $request->bestseller ?? 'all',
                'sort' => $request->sort ?? 'newest',
                'per_page' => $request->per_page ?? 10,
            ],
        ]);
    }

    public function create()
    {
        Gate::authorize('product-create');

        return Inertia::render('backpanel/product/create', [
            'brands' => Brand::orderBy('name')->get(),

            'categories' => $this->getCategories(),
        ]);
    }

    public function store(Request $request)
    {
        Gate::authorize('product-create');

        $this->normalizeInputs($request);

        $validated = $request->validate(
            $this->validationRules()
        );

        $validated = $this->prepareProductData($validated);

        $product = Product::create($validated);

        $this->insertNewTags(
            $validated['tags'] ?? [],
            'product'
        );

        $this->handleProductImages([
            'request' => $request,
            'product' => $product,
            'validated' => $validated,
        ]);

        return redirect()
            ->route('cms.product.index', ['status' => 'published'])
            ->with('success', 'Produk berhasil dibuat');
    }

    public function show($id)
    {
        Gate::authorize('product-list');

        $product = Product::with([
            'brand',
            'category',
            'images' => fn ($q) => $q->orderBy('position'),
        ])->findOrFail($id);

        $product->setAttribute(
            'full_category',
            $product->category?->getHierarchy()
        );

        return Inertia::render('backpanel/product/show', [
            'product' => $product,
        ]);
    }

    public function edit($id)
    {
        Gate::authorize('product-edit');

        $product = Product::with([
            'brand',
            'category',
            'images' => fn ($q) => $q->orderBy('position'),
        ])->findOrFail($id);

        return Inertia::render('backpanel/product/edit', [
            'product' => $product,
            'brands' => Brand::orderBy('name')->get(),
            'categories' => $this->getCategories(),
        ]);
    }

    public function update(Request $request, $id)
    {
        Gate::authorize('product-edit');

        $product = Product::findOrFail($id);

        $this->normalizeInputs($request);

        $validated = $request->validate(
            $this->validationRules($product->id, true)
        );

        $validated = $this->prepareProductData($validated);

        $product->update($validated);

        $this->insertNewTags(
            $validated['tags'] ?? [],
            'product'
        );

        $this->handleProductImages([
            'request' => $request,
            'product' => $product,
            'validated' => $validated,
            'is_update' => true,
        ]);

        return redirect()
            ->route('cms.product.index',['status' => 'published'])
            ->with('success', 'Produk berhasil diperbarui');
    }

    public function destroy($id)
    {
        Gate::authorize('product-delete');

        $product = Product::with('images')
            ->findOrFail($id);

        foreach ($product->images as $image) {
            Storage::disk('public')
                ->delete($image->image_path);

            $image->delete();
        }

        $product->delete();

        return redirect()
            ->route('cms.product.index', ['status' => 'published'])
            ->with('success', 'Produk berhasil dihapus');
    }

    public function toggleStatus($id)
    {
        Gate::authorize('product-edit');

        $product = Product::findOrFail($id);

        $product->update([
            'status' => $product->status === 'published'
                ? 'draft'
                : 'published',
        ]);

        return back()->with(
            'success',
            'Status produk berhasil diperbarui'
        );
    }

    public function toggleFeatured($id)
    {
        Gate::authorize('product-edit');

        $product = Product::findOrFail($id);

        $product->update([
            'is_featured' => !$product->is_featured,
        ]);

        return back()->with(
            'success',
            'Status unggulan produk berhasil diperbarui'
        );
    }

    public function toggleBestseller($id)
    {
        Gate::authorize('product-edit');

        $product = Product::findOrFail($id);

        $product->update([
            'is_bestseller' => !$product->is_bestseller,
        ]);

        return back()->with(
            'success',
            'Status terlaris produk berhasil diperbarui'
        );
    }

    public function updatePosition(Request $request)
    {
        Gate::authorize('product-edit');

        $validated = $request->validate([
            'products' => 'required|array',
            'products.*.id' => 'required|integer|exists:products,id',
            'products.*.position' => 'required|integer|min:0',
        ]);

        foreach ($validated['products'] as $item) {
            Product::where('id', $item['id'])
                ->update([
                    'position' => $item['position'],
                ]);
        }

        return back()->with(
            'success',
            'Posisi produk berhasil diperbarui'
        );
    }

    /*
    |--------------------------------------------------------------------------
    | PRIVATE METHODS
    |--------------------------------------------------------------------------
    */

    private function validationRules(
        ?int $productId = null,
        bool $isUpdate = false
    ): array {
        return [
            'name' => 'required|string|max:255',

            'slug' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('products', 'slug')
                    ->ignore($productId),
            ],

            'type' => 'required|string|in:physical,digital',

            'description' => 'nullable|string',

            'short_description' => 'nullable|string|max:500',

            'sku' => [
                'nullable',
                'string',
                'max:100',
                Rule::unique('products', 'sku')
                    ->ignore($productId),
            ],

            'price' => 'required|numeric|min:0',

            'compare_at_price' => 'nullable|numeric|min:0',

            'cost_per_item' => 'nullable|numeric|min:0',

            'track_quantity' => 'boolean',

            'quantity' => 'nullable|integer|min:0',

            'barcode' => 'nullable|string|max:100',

            'status' => 'required|string|in:draft,published',

            'is_featured' => 'boolean',
            'is_bestseller' => 'boolean',
            'is_new' => 'boolean',
            'is_for_sell' => 'boolean',
            'is_rent' => 'boolean',

            'show_price' => 'boolean',
            'show_stock' => 'boolean',

            'position' => 'nullable|integer|min:0',

            'brand_id' => 'nullable|exists:brands,id',

            'category_id' => 'nullable|exists:categories,id',

            'meta_title' => 'nullable|string|max:255',

            'meta_description' => 'nullable|string|max:500',

            'tags' => 'nullable|array',

            'tags.*' => 'nullable|string|max:50',

            'specific_specs' => 'nullable|array',

            'specific_specs.*.label' => 'required|string|max:255',

            'specific_specs.*.value' => 'required|string|max:255',

            'specific_specs.*.note' => 'nullable|string|max:500',

            'images' => 'nullable|array|max:5',

            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:5048',

            'remove_images' => 'nullable|array',

            'remove_images.*' => 'nullable|integer|exists:product_images,id',

            'cover_image' => $isUpdate
                ? 'nullable|string'
                : 'nullable|integer|min:0',
        ];
    }

    private function normalizeInputs(Request $request): void
    {
        $request->merge([
            'price' => normalize_currency($request->price),

            'compare_at_price' => normalize_currency(
                $request->compare_at_price
            ),

            'cost_per_item' => normalize_currency(
                $request->cost_per_item
            ),

            'brand_id' => $request->brand_id === 'none'
                ? null
                : $request->brand_id,

            'category_id' => $request->category_id === 'none'
                ? null
                : $request->category_id,
        ]);
    }

    private function prepareProductData(array $validated): array
    {
        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug(
                $validated['name']
            );
        }

        if (isset($validated['tags'])) {
            $validated['tags'] = array_values(
                array_filter($validated['tags'])
            );
        }

        $validated['is_featured'] =
            $validated['is_featured'] ?? false;

        $validated['is_bestseller'] =
            $validated['is_bestseller'] ?? false;

        $validated['is_new'] =
            $validated['is_new'] ?? false;

        $validated['is_for_sell'] =
            $validated['is_for_sell'] ?? false;

        $validated['is_rent'] =
            $validated['is_rent'] ?? false;

        $validated['show_price'] =
            $validated['show_price'] ?? true;

        $validated['show_stock'] =
            $validated['show_stock'] ?? true;

        $validated['track_quantity'] =
            $validated['track_quantity'] ?? true;

        $validated['position'] =
            $validated['position'] ?? 0;

        return $validated;
    }

    private function getCategories()
    {
        return Category::with('children')
            ->ofType('product')
            ->root()
            ->active()
            ->orderBy('lft')
            ->get();
    }

    private function getSort(?string $sort): array
    {
        return match ($sort) {

            'oldest' => ['created_at', 'asc'],
            'newest' => ['created_at', 'desc'],

            'name_asc' => ['name', 'asc'],
            'name_desc' => ['name', 'desc'],

            'price_low' => ['price', 'asc'],
            'price_high' => ['price', 'desc'],

            'stock_low' => ['quantity', 'asc'],
            'stock_high' => ['quantity', 'desc'],

            'most_viewed' => ['views', 'desc'],
            'least_viewed' => ['views', 'asc'],

            default => ['created_at', 'desc'],
        };
    }

    private function getProductImagePath(?string $path): string
    {
        if (!$path) {
            return '/images/placeholder.png';
        }

        if (!str_starts_with($path, '/storage/')) {
            $path = '/storage/' . ltrim($path, '/');
        }

        if (!file_exists(public_path($path))) {
            return '/images/placeholder.png';
        }

        return $path;
    }

    private function insertNewTags(
        array $tags,
        string $type
    ): void {
        foreach ($tags as $tagName) {

            $tagName = trim($tagName);

            if (empty($tagName)) {
                continue;
            }

            $slug = Str::slug($tagName);

            $exists = Tag::where('slug', $slug)
                ->orWhere('name', $tagName)
                ->exists();

            if (!$exists) {
                Tag::create([
                    'name' => $tagName,
                    'slug' => $slug,
                    'type' => $type,
                ]);
            }
        }
    }

    private function handleProductImages(array $data): void
    {
        $request = $data['request'];
        $product = $data['product'];
        $validated = $data['validated'];
        $isUpdate = $data['is_update'] ?? false;

        /*
        |--------------------------------------------------------------------------
        | REMOVE IMAGES
        |--------------------------------------------------------------------------
        */

        if (
            $isUpdate &&
            isset($validated['remove_images']) &&
            is_array($validated['remove_images'])
        ) {
            foreach ($validated['remove_images'] as $imageId) {

                $image = ProductImage::find($imageId);

                if (
                    $image &&
                    $image->product_id === $product->id
                ) {
                    Storage::disk('public')
                        ->delete($image->image_path);

                    $image->delete();
                }
            }
        }

        /*
        |--------------------------------------------------------------------------
        | UPLOAD IMAGES
        |--------------------------------------------------------------------------
        */

        $newImageIds = [];

        if ($request->hasFile('images')) {

            $images = $request->file('images');

            $maxPosition = $product->images()
                ->max('position') ?? 0;

            foreach ($images as $index => $image) {

                // $path = $image->store(
                //     'products',
                //     'public'
                // );

                $path = $this->optimizeSeoImage(
                    file: $image,
                    directory: 'products',
                    width: 1200,
                    height: 630,
                    quality: 82
                );

                $productImage = ProductImage::create([
                    'product_id' => $product->id,
                    'image_path' => $path,
                    'is_cover' => false,
                    'position' => $maxPosition + $index + 1,
                ]);

                $newImageIds[] = $productImage->id;
            }
        }

        /*
        |--------------------------------------------------------------------------
        | HANDLE DEFAULT COVER
        |--------------------------------------------------------------------------
        | Jika tidak ada cover dipilih dan belum ada
        | gambar cover sama sekali, maka gunakan
        | gambar pertama sebagai cover
        |--------------------------------------------------------------------------
        */

        $coverImageValue = $validated['cover_image'] ?? null;

        if (
            empty($coverImageValue)
        ) {

            $hasCover = $product->images()
                ->where('is_cover', true)
                ->exists();

            if (!$hasCover) {

                $firstImage = $product->images()
                    ->orderBy('position')
                    ->first();

                if ($firstImage) {

                    $product->images()->update([
                        'is_cover' => false,
                    ]);

                    $firstImage->update([
                        'is_cover' => true,
                    ]);
                }
            }

            return;
        }

        /*
        |--------------------------------------------------------------------------
        | RESET ALL COVERS
        |--------------------------------------------------------------------------
        */

        $product->images()->update([
            'is_cover' => false,
        ]);

        /*
        |--------------------------------------------------------------------------
        | STORE COVER
        |--------------------------------------------------------------------------
        */

        if (
            !$isUpdate &&
            is_numeric($coverImageValue)
        ) {
            $coverImage = $product->images()
                ->orderBy('position')
                ->skip((int) $coverImageValue)
                ->first();

            if ($coverImage) {
                $coverImage->update([
                    'is_cover' => true,
                ]);
            }

            return;
        }

        /*
        |--------------------------------------------------------------------------
        | UPDATE - NEW IMAGE COVER
        |--------------------------------------------------------------------------
        */

        if (
            $isUpdate &&
            str_starts_with($coverImageValue, 'new_')
        ) {
            $newImageIndex = (int) str_replace(
                'new_',
                '',
                $coverImageValue
            );

            if (isset($newImageIds[$newImageIndex])) {

                ProductImage::where(
                    'id',
                    $newImageIds[$newImageIndex]
                )->update([
                    'is_cover' => true,
                ]);
            }

            return;
        }

        /*
        |--------------------------------------------------------------------------
        | UPDATE - EXISTING IMAGE COVER
        |--------------------------------------------------------------------------
        */

        if (
            $isUpdate &&
            is_numeric($coverImageValue)
        ) {
            $coverImage = $product->images()
                ->where('id', $coverImageValue)
                ->first();

            if ($coverImage) {
                $coverImage->update([
                    'is_cover' => true,
                ]);
            }
        }
    }
}