<?php

namespace App\Services\Cashflow;

use App\DTOs\Cashflow\Category\CreateCategoryData;
use App\DTOs\Cashflow\Category\UpdateCategoryData;
use App\Models\Cashflow\Category;
use Illuminate\Support\Facades\DB;

class CategoryService extends BaseService
{

    public function getCategoryTree(
        $workspaceId
    ){
        return Category::where('workspace_id', $workspaceId)
            ->whereNull('parent_id') // Ambil induknya saja dulu
            ->with('children')       // Otomatis menarik anak-anaknya ke dalam array/object
            ->orderBy('sort_order')
            ->get();
    }

    public function create(
        CreateCategoryData $data
    ): Category {

        return DB::transaction(function () use ($data) {

            $category = Category::create([
                'name' => $data->name,
                'parent_id' => $data->parentId,
                'type' => $data->type,
                'icon' => $data->icon,
                'color' => $data->color,
                'description' => $data->description,
                'is_active' => $data->isActive,
            ]);

            $this->activityLogService->created(
                $category,
                "Membuat kategori {$category->name}"
            );

            return $category;
        });
    }

    public function update(
        Category $category,
        UpdateCategoryData $data
    ): Category {

        $oldValues = $category->only([
            'name',
            'type',
            'icon',
            'color',
            'description',
            'is_active',
        ]);

        $category->update([
            'name' => $data->name,
            'parent_id' => $data->parentId,
            'type' => $data->type,
            'icon' => $data->icon,
            'color' => $data->color,
            'description' => $data->description,
            'is_active' => $data->isActive,
        ]);

        $this->activityLogService->updated(
            subject: $category,
            oldValues: $oldValues,
            newValues: $category->fresh()->only([
                'name',
                'type',
                'icon',
                'color',
                'description',
                'is_active',
            ]),
            description: "Mengubah kategori {$category->name}"
        );

        return $category->fresh();
    }

    public function archive(
        Category $category
    ): Category {

        $category->update([
            'is_active' => false,
        ]);

        $this->activityLogService->custom(
            event: 'category.archived',
            subject: $category,
            description: "Mengarsipkan kategori {$category->name}"
        );

        return $category->fresh();
    }

    public function activate(
        Category $category
    ): Category {

        $category->update([
            'is_active' => true,
        ]);

        $this->activityLogService->custom(
            event: 'category.activated',
            subject: $category,
            description: "Mengaktifkan kategori {$category->name}"
        );

        return $category->fresh();
    }

    public function delete(
        Category $category
    ): void {

        $hasTransactions = $category->transactions()
            ->exists();

        if ($hasTransactions) {
            throw new \Exception(
                'Kategori masih digunakan transaksi.'
            );
        }

        $this->activityLogService->deleted(
            $category,
            "Menghapus kategori {$category->name}"
        );

        $category->update([
            'deleted_by' => current_user_id(),
        ]);

        $category->delete();
    }
}