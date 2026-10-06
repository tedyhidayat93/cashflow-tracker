<?php

namespace App\Http\Controllers\Apps\Cashflow;

use App\DTOs\Cashflow\Wallet\CreateWalletTransferData;
use App\DTOs\Cashflow\Wallet\UpdateWalletTransferData;
use App\Http\Requests\Apps\Cashflow\StoreTransferRequest;
use App\Models\Workspace;
use App\Services\Cashflow\CategoryService;
use App\Services\Cashflow\WalletService;
use App\Services\Cashflow\WalletTransferService;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WalletTransferController extends Controller
{
    public function __construct(
        protected WalletTransferService $transferService,
        protected WalletService $walletService,
        protected CategoryService $categoryService,
    ) {}

    public function index(Request $request, Workspace $workspace): Response
    {
        $filters = $request->only(['search', 'wallet_id', 'date_from', 'date_to']);

        return Inertia::render('apps/cashflow/transfers/index', [
            'workspace' => $this->workspacePayload($workspace),
            'transfers' => $this->transferService->paginate($filters, $request->integer('per_page', 15)),
            'wallets'   => $this->walletService->listActive(),
            'filters'   => $filters,
        ]);
    }

    public function store(StoreTransferRequest $request, Workspace $workspace): RedirectResponse
    {
        $this->transferService->create(new CreateWalletTransferData(
            fromWalletId: $request->integer('from_wallet_id'),
            toWalletId: $request->integer('to_wallet_id'),
            amount: (float) $request->input('amount'),
            fee: (float) $request->input('fee', 0),
            referenceNumber: $request->input('reference_number'),
            title: $request->input('title'),
            description: $request->input('description'),
            transferDate: Carbon::parse($request->input('transfer_date')),
            metadata: $request->input('metadata') ?? null,
        ));

        return back()->with('success', 'Transfer berhasil dibuat.');
    }

    public function update(StoreTransferRequest $request, Workspace $workspace, int $id): RedirectResponse
    {
        $transfer = $this->transferService->findOrFail($id);

        $this->transferService->update($transfer, new UpdateWalletTransferData(
            fromWalletId: $request->integer('from_wallet_id'),
            toWalletId: $request->integer('to_wallet_id'),
            amount: (float) $request->input('amount'),
            fee: (float) $request->input('fee', 0),
            referenceNumber: $request->input('reference_number'),
            title: $request->input('title'),
            description: $request->input('description'),
            transferDate: Carbon::parse($request->input('transfer_date')),
            metadata: $request->input('metadata') ?? null,
        ));

        return back()->with('success', 'Transfer berhasil diperbarui.');
    }

    public function destroy(Workspace $workspace, int $id): RedirectResponse
    {
        $this->transferService->delete($this->transferService->findOrFail($id));

        return back()->with('success', 'Transfer dihapus dan saldo dikembalikan.');
    }
}