<?php

namespace App\Services\Cashflow;

use App\DTOs\Cashflow\Budget\CreateBudgetData;
use App\DTOs\Cashflow\Budget\UpdateBudgetData;
use App\Models\Cashflow\Budget;
use Illuminate\Support\Facades\DB;

class BudgetService extends BaseService
{
    public function create(
        CreateBudgetData $data
    ): Budget {

        return DB::transaction(function () use ($data) {

            $budget = Budget::create([
                'category_id' => $data->categoryId,
                'name' => $data->name,
                'amount' => $data->amount,
                'period' => $data->period,
                'start_date' => $data->startDate,
                'end_date' => $data->endDate,
                'is_active' => $data->isActive,
            ]);

            $this->activityLogService->created(
                $budget,
                "Membuat budget {$budget->name}"
            );

            return $budget;
        });
    }

    public function update(
        Budget $budget,
        UpdateBudgetData $data
    ): Budget {

        $oldValues = $budget->toArray();

        $budget->update([
            'name' => $data->name,
            'amount' => $data->amount,
            'period' => $data->period,
            'start_date' => $data->startDate,
            'end_date' => $data->endDate,
            'is_active' => $data->isActive,
        ]);

        $this->activityLogService->updated(
            subject: $budget,
            oldValues: $oldValues,
            newValues: $budget->fresh()->toArray(),
            description: "Mengubah budget {$budget->name}"
        );

        return $budget->fresh();
    }

    public function archive(
        Budget $budget
    ): Budget {

        $budget->update([
            'is_active' => false,
        ]);

        $this->activityLogService->custom(
            event: 'budget.archived',
            subject: $budget,
            description: "Mengarsipkan budget {$budget->name}"
        );

        return $budget->fresh();
    }

    public function activate(
        Budget $budget
    ): Budget {

        $budget->update([
            'is_active' => true,
        ]);

        $this->activityLogService->custom(
            event: 'budget.activated',
            subject: $budget,
            description: "Mengaktifkan budget {$budget->name}"
        );

        return $budget->fresh();
    }

    public function getRemainingAmount(
        Budget $budget
    ): float
    {
        $used = $budget->transactions()
            ->sum('amount');

        return max(
            0,
            $budget->amount - $used
        );
    }

    public function getUsedAmount(
        Budget $budget
    ): float
    {
        return $budget->transactions()
            ->sum('amount');
    }

    public function getUsagePercentage(
        Budget $budget
    ): float
    {
        if ($budget->amount <= 0) {
            return 0;
        }

        return round(
            ($this->getUsedAmount($budget) / $budget->amount) * 100,
            2
        );
    }

    public function delete(
        Budget $budget
    ): void {

        $this->activityLogService->deleted(
            $budget,
            "Menghapus budget {$budget->name}"
        );

        $budget->update([
            'deleted_by' => current_user_id(),
        ]);

        $budget->delete();
    }
}