<?php

namespace App\Http\Requests\Apps\Cashflow;

use App\Enums\Cashflow\TransactionType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTransactionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $workspaceId = current_workspace_id();

        return [
            'wallet_id' => [
                'required',
                'integer',
                Rule::exists('cf_wallets', 'id')->where(fn ($query) => $query->where('workspace_id', $workspaceId)),
            ],
            'category_id' => [
                'required',
                'integer',
                Rule::exists('cf_categories', 'id')->where(fn ($query) => $query->where('workspace_id', $workspaceId)),
            ],
            'title' => ['required', 'string', 'max:255'],
            'amount' => ['required', 'numeric', 'min:0.01'],
            'transaction_date' => ['required', 'date'],
            'description' => ['nullable', 'string'],
            'reference_number' => ['nullable', 'string', 'max:100'],
            'type' => ['nullable', Rule::enum(TransactionType::class)],
        ];
    }
}
