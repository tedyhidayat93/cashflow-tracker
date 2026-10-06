<?php

namespace App\Http\Controllers\Apps\Cashflow;

use App\Enums\Cashflow\TransactionType;
use App\Models\Workspace;
use App\Services\Cashflow\CategoryService;
use App\Services\Cashflow\TransactionService;
use App\Services\Cashflow\WalletService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TransactionController extends Controller
{
    public function __construct(
        protected TransactionService $transactionService,
        protected CategoryService $categoryService,
        protected WalletService $walletService,
    ) {}

    public function index(Request $request, Workspace $workspace): Response
    {
        $type = $request->filled('type')
            ? TransactionType::tryFrom($request->string('type')->toString())
            : null;

        return Inertia::render('apps/cashflow/transactions/index', [
            'workspace' => $this->workspacePayload($workspace),
            'transactions' => $this->transactionService->paginate(
                type: $type,
                search: $request->string('search')->toString() ?: null,
                dateFrom: $request->string('date_from')->toString() ?: null,
                dateTo: $request->string('date_to')->toString() ?: null,
                walletId: $request->integer('wallet_id') ?: null,
                categoryId: $request->integer('category_id') ?: null,
            ),
            'wallets' => $this->walletService->listActive(),
            'categories' => $this->categoryService->listByType(),
            'filters' => $request->only(['search', 'date_from', 'date_to', 'type', 'wallet_id', 'category_id']),
        ]);
    }

    public function show(Workspace $workspace, int $id): Response
    {
        $transaction = $this->transactionService->findOrFail($id);

        return Inertia::render('apps/cashflow/transactions/show', [
            'workspace' => $this->workspacePayload($workspace),
            'transaction' => $this->transactionService->present($transaction),
        ]);
    }
}
