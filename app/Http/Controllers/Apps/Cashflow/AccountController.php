<?php

namespace App\Http\Controllers\Apps\Cashflow;

use App\DTOs\Cashflow\Wallet\CreateWalletData;
use App\DTOs\Cashflow\Wallet\UpdateWalletData;
use App\Enums\Cashflow\WalletType;
use App\Http\Requests\Apps\Cashflow\StoreWalletRequest;
use App\Http\Requests\Apps\Cashflow\UpdateWalletRequest;
use App\Models\Workspace;
use App\Services\Cashflow\WalletService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AccountController extends Controller
{
    public function __construct(
        protected WalletService $walletService,
    ) {}

    public function index(Request $request, Workspace $workspace): Response
    {
        return Inertia::render('apps/cashflow/accounts/index', [
            'workspace' => $this->workspacePayload($workspace),
            'wallets' => $this->walletService->paginate(
                search: $request->string('search')->toString() ?: null,
            ),
            'types' => WalletType::options(),
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(StoreWalletRequest $request, Workspace $workspace): RedirectResponse
    {
        $this->walletService->create(new CreateWalletData(
            name: $request->string('name')->toString(),
            type: WalletType::from($request->string('type')->toString()),
            openingBalance: (float) $request->input('opening_balance', 0),
            currency: $request->input('currency') ?: ($workspace->currency ?? 'IDR'),
            accountNumber: $request->input('account_number'),
            bankName: $request->input('bank_name'),
            description: $request->input('description'),
            isActive: $request->boolean('is_active', true),
        ));

        return back()->with('success', 'Dompet / rekening berhasil dibuat.');
    }

    public function update(UpdateWalletRequest $request, Workspace $workspace, int $id): RedirectResponse
    {
        $wallet = $this->walletService->findOrFail($id);

        $this->walletService->update($wallet, new UpdateWalletData(
            name: $request->string('name')->toString(),
            type: $request->string('type')->toString(),
            currency: $request->input('currency') ?: ($workspace->currency ?? 'IDR'),
            accountNumber: $request->input('account_number'),
            bankName: $request->input('bank_name'),
            description: $request->input('description'),
            isActive: $request->boolean('is_active', true),
        ));

        return back()->with('success', 'Dompet / rekening berhasil diperbarui.');
    }

    public function destroy(Workspace $workspace, int $id): RedirectResponse
    {
        $wallet = $this->walletService->findOrFail($id);
        $this->walletService->delete($wallet);

        return back()->with('success', 'Dompet / rekening berhasil dihapus.');
    }
}
