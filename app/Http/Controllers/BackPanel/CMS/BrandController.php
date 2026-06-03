<?php

namespace App\Http\Controllers\BackPanel\CMS;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class BrandController extends Controller
{
    public function __construct()
    {
        // Apply permission middleware to all methods
        $this->middleware('permission:brand-list')->only(['index', 'show']);
        $this->middleware('permission:brand-create')->only(['create', 'store']);
        $this->middleware('permission:brand-edit')->only(['edit', 'update', 'toggleStatus']);
        $this->middleware('permission:brand-delete')->only(['destroy']);
    }
    public function index(Request $request)
    {
        Gate::authorize('brand-list');
        
        $brands = Brand::when($request->search, function ($query, $search) {
                return $query->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('website', 'like', "%{$search}%");
            })
            ->when($request->has('active'), function ($query) use ($request) {
                $isActive = $request->boolean('active');
                return $query->where('is_active', $isActive);
            })
            ->orderBy('id')
            ->orderBy('position')
            ->paginate(10);

        return Inertia::render('backpanel/brand/index', [
            'brands' => $brands,
            'filters' => $request->only(['search', 'active'])
        ]);
    }

    public function create()
    {
        Gate::authorize('brand-create');
        
        return Inertia::render('backpanel/brand/create');
    }

    public function store(Request $request)
    {
        Gate::authorize('brand-create');
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:brands,slug',
            'description' => 'nullable|string',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'website' => 'nullable|url|max:255',
            'is_active' => 'boolean',
            'position' => 'nullable|integer|min:0',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        if ($request->hasFile('logo')) {
            $logo = $request->file('logo');
            $path = $logo->store('brands', 'public');
            $validated['logo'] = $path;
        }

        $validated['is_active'] = $validated['is_active'] ?? true;
        $validated['position'] = $validated['position'] ?? 0;

        $brand = Brand::create($validated);

        return redirect()->route('cms.brand.index')
            ->with('success', 'Merek berhasil dibuat');
    }

    public function show($id)
    {
        Gate::authorize('brand-list');
        
        $brand = Brand::findOrFail($id);

        return Inertia::render('backpanel/brand/show', [
            'brand' => $brand
        ]);
    }

    public function edit($id)
    {
        Gate::authorize('brand-edit');
        
        $brand = Brand::findOrFail($id);

        return Inertia::render('backpanel/brand/edit', [
            'brand' => $brand
        ]);
    }

    public function update(Request $request, $id)
    {
        Gate::authorize('brand-edit');
        
        $brand = Brand::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('brands')->ignore($brand->id),
            ],
            'description' => 'nullable|string',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'website' => 'nullable|url|max:255',
            'is_active' => 'boolean',
            'position' => 'nullable|integer|min:0',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        // Handle image upload
        if ($request->hasFile('logo')) {
            // Delete old image if exists
            if ($brand->logo) {
                Storage::disk('public')->delete($brand->logo);
            }
            $logo = $request->file('logo');
            $path = $logo->store('brands', 'public');
            $validated['logo'] = $path;
        }

        // Handle image removal
        if ($request->input('remove_logo') && $brand->logo) {
            Storage::disk('public')->delete($brand->logo);
            $validated['logo'] = null;
        }

        $validated['is_active'] = isset($validated['is_active']) 
            ? (bool) $validated['is_active'] 
            : $brand->is_active;
        $validated['position'] = $validated['position'] ?? $brand->position;

        $brand->update($validated);

        return redirect()->route('cms.brand.index')
            ->with('success', 'Merek berhasil diperbarui');
    }

    public function destroy($id)
    {
        Gate::authorize('brand-delete');
        
        $brand = Brand::findOrFail($id);

        if ($brand->logo) {
            Storage::disk('public')->delete($brand->logo);
        }

        $brand->delete();

        return redirect()->route('cms.brand.index')
            ->with('success', 'Merek berhasil dihapus');
    }

    public function toggleStatus($id)
    {
        Gate::authorize('brand-edit');
        
        $brand = Brand::findOrFail($id);
        $brand->is_active = !$brand->is_active;
        $brand->save();

        return redirect()->route('cms.brand.index')
            ->with('success', 'Status merek berhasil diperbarui');
    }

    public function updatePosition(Request $request)
    {
        $validated = $request->validate([
            'brands' => 'required|array',
            'brands.*.id' => 'required|integer|exists:brands,id',
            'brands.*.position' => 'required|integer|min:0',
        ]);

        foreach ($validated['brands'] as $brandData) {
            Brand::where('id', $brandData['id'])
                ->update(['position' => $brandData['position']]);
        }

        return redirect()->route('cms.brand.index')
            ->with('success', 'Posisi merek berhasil diperbarui');
    }
}
