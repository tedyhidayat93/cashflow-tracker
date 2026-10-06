<?php

namespace App\Http\Controllers\Apps\Cashflow;

use App\DTOs\Cashflow\Category\CreateCategoryData;
use App\DTOs\Cashflow\Category\UpdateCategoryData;
use App\Enums\Cashflow\CategoryType;
use App\Http\Requests\Apps\Cashflow\StoreCategoryRequest;
use App\Http\Requests\Apps\Cashflow\UpdateCategoryRequest;
use App\Models\Workspace;
use App\Services\Cashflow\CategoryService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function __construct(
        protected CategoryService $categoryService,
    ) {}

    public function index(Request $request, Workspace $workspace): Response
    {
        return Inertia::render('apps/cashflow/categories/index', [
            'workspace' => $this->workspacePayload($workspace),
            'categories' => $this->categoryService->paginate(
                search: $request->string('search')->toString() ?: null,
                type: $request->string('type')->toString() ?: null,
            ),
            'parents' => $this->categoryService->listByType(),
            'types' => CategoryType::options(),
            'filters' => $request->only(['search', 'type']),
        ]);
    }

    public function store(StoreCategoryRequest $request, Workspace $workspace): RedirectResponse
    {
        $this->categoryService->create(new CreateCategoryData(
            parentId: $request->filled('parent_id') ? $request->integer('parent_id') : null,
            name: $request->string('name')->toString(),
            type: CategoryType::from($request->string('type')->toString()),
            icon: $request->input('icon'),
            color: $request->input('color'),
            description: $request->input('description'),
            isActive: $request->boolean('is_active', true),
        ));

        return back()->with('success', 'Kategori berhasil dibuat.');
    }

    public function update(UpdateCategoryRequest $request, Workspace $workspace, int $id): RedirectResponse
    {
        $category = $this->categoryService->findOrFail($id);

        $this->categoryService->update($category, new UpdateCategoryData(
            parentId: $request->filled('parent_id') ? $request->integer('parent_id') : null,
            name: $request->string('name')->toString(),
            type: CategoryType::from($request->string('type')->toString()),
            icon: $request->input('icon'),
            color: $request->input('color'),
            description: $request->input('description'),
            isActive: $request->boolean('is_active', true),
        ));

        return back()->with('success', 'Kategori berhasil diperbarui.');
    }

    public function destroy(Workspace $workspace, int $id): RedirectResponse
    {
        $category = $this->categoryService->findOrFail($id);

        try {
            $this->categoryService->delete($category);
        } catch (\Throwable $e) {
            return back()->with('error', $e->getMessage());
        }

        return back()->with('success', 'Kategori berhasil dihapus.');
    }
}
