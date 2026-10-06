<?php

namespace App\Http\Requests\Apps\Cashflow;

use App\Models\Cashflow\Wallet;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTransferRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // Gunakan Rule::exists(Wallet::class, 'id') agar Laravel mengambil nama tabel langsung dari Model
            'from_wallet_id'   => ['required', 'integer', Rule::exists(Wallet::class, 'id')],
            'to_wallet_id'     => ['required', 'integer', Rule::exists(Wallet::class, 'id'), 'different:from_wallet_id'],
            'amount'           => ['required', 'numeric', 'gt:0'],
            'fee'              => ['nullable', 'numeric', 'gte:0'],
            'transfer_date'    => ['required', 'date'],
            'title'            => ['nullable', 'string', 'max:255'],
            'reference_number' => ['nullable', 'string', 'max:255'],
            'description'      => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function messages(): array
    {
        return [
            'to_wallet_id.different' => 'Wallet tujuan harus berbeda dengan wallet asal.',
        ];
    }
}