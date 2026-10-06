<?php

namespace App\Services\Cashflow;

use App\DTOs\Cashflow\Account\CreateAccountData;
use App\DTOs\Cashflow\Account\UpdateAccountData;
use App\Enums\Cashflow\AccountType;
use App\Models\Cashflow\Account;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class AccountService extends BaseService
{
    public function paginate(
        ?string $search = null,
        ?string $type = null,
        int $perPage = 15,
    ): LengthAwarePaginator {
        return Account::forWorkspace()
            ->when($search, function ($query, $search) {
                $query->where(function ($inner) use ($search) {
                    $inner->where('name', 'like', "%{$search}%")
                        ->orWhere('code', 'like', "%{$search}%");
                });
            })
            ->when($type, fn ($query) => $query->where('type', $type))
            ->orderBy('code')
            ->paginate($perPage)
            ->withQueryString();
    }

    public function findOrFail(int $id): Account
    {
        return Account::forWorkspace()->findOrFail($id);
    }

    public function create(CreateAccountData $data): Account
    {
        return DB::transaction(function () use ($data) {
            $this->assertUniqueCode($data->code);

            $account = Account::create([
                'code' => $data->code,
                'name' => $data->name,
                'type' => $data->type,
                'description' => $data->description,
                'is_active' => $data->isActive,
            ]);

            $this->activityLogService->created(
                $account,
                "Membuat akun {$account->code} - {$account->name}"
            );

            return $account;
        });
    }

    public function update(Account $account, UpdateAccountData $data): Account
    {
        $this->assertUniqueCode($data->code, $account->id);

        $oldValues = $account->only(['code', 'name', 'type', 'description', 'is_active']);

        $account->update([
            'code' => $data->code,
            'name' => $data->name,
            'type' => $data->type,
            'description' => $data->description,
            'is_active' => $data->isActive,
        ]);

        $this->activityLogService->updated(
            subject: $account,
            oldValues: $oldValues,
            newValues: $account->fresh()->only(['code', 'name', 'type', 'description', 'is_active']),
            description: "Mengubah akun {$account->code} - {$account->name}"
        );

        return $account->fresh();
    }

    public function delete(Account $account): void
    {
        $this->activityLogService->deleted(
            $account,
            "Menghapus akun {$account->code} - {$account->name}"
        );

        $account->delete();
    }

    public function types(): array
    {
        return AccountType::options();
    }

    private function assertUniqueCode(string $code, ?int $ignoreId = null): void
    {
        $exists = Account::forWorkspace()
            ->where('code', $code)
            ->when($ignoreId, fn ($query) => $query->where('id', '!=', $ignoreId))
            ->exists();

        if ($exists) {
            throw ValidationException::withMessages([
                'code' => 'Kode akun sudah digunakan di workspace ini.',
            ]);
        }
    }
}
