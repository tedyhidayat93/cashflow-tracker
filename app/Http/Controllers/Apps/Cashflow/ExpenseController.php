<?php

namespace App\Http\Controllers\Apps\Cashflow;

use App\DTOs\Cashflow\Transaction\CreateTransactionData;
use App\DTOs\Cashflow\Transaction\UpdateTransactionData;
use App\Enums\Cashflow\CategoryType;
use App\Enums\Cashflow\TransactionType;
use App\Http\Requests\Apps\Cashflow\StoreTransactionRequest;
use App\Http\Requests\Apps\Cashflow\UpdateTransactionRequest;
use App\Models\Workspace;
use App\Services\Cashflow\CategoryService;
use App\Services\Cashflow\TransactionService;
use App\Services\Cashflow\WalletService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ExpenseController extends Controller
{
    public function __construct(
        protected TransactionService $transactionService,
        protected CategoryService $categoryService,
        protected WalletService $walletService,
    ) {}

    public function index(Request $request, Workspace $workspace): Response
    {
        return Inertia::render('apps/cashflow/expense/index', [
            'workspace' => $this->workspacePayload($workspace),
            'transactions' => $this->transactionService->paginate(
                type: TransactionType::EXPENSE,
                search: $request->string('search')->toString() ?: null,
                dateFrom: $request->string('date_from')->toString() ?: null,
                dateTo: $request->string('date_to')->toString() ?: null,
            ),
            'filters' => $request->only(['search', 'date_from', 'date_to']),
        ]);
    }

    public function create(Workspace $workspace): Response
    {
        return Inertia::render('apps/cashflow/expense/create', $this->formProps($workspace));
    }

    public function store(StoreTransactionRequest $request, Workspace $workspace): RedirectResponse
    {
        $this->transactionService->create($this->toCreateData($request));

        return redirect()
            ->route('workspace.cashflow.expense.index', $workspace)
            ->with('success', 'Pengeluaran berhasil dicatat.');
    }

    public function edit(Workspace $workspace, int $id): Response
    {
        $transaction = $this->transactionService->findOrFail($id);

        abort_unless($transaction->type === TransactionType::EXPENSE, 404);

        return Inertia::render('apps/cashflow/expense/edit', [
            ...$this->formProps($workspace),
            'transaction' => $this->transactionService->present($transaction),
        ]);
    }

    public function update(UpdateTransactionRequest $request, Workspace $workspace, int $id): RedirectResponse
    {
        $transaction = $this->transactionService->findOrFail($id);

        abort_unless($transaction->type === TransactionType::EXPENSE, 404);

        $this->transactionService->update($transaction, $this->toUpdateData($request));

        return redirect()
            ->route('workspace.cashflow.expense.index', $workspace)
            ->with('success', 'Pengeluaran berhasil diperbarui.');
    }

    public function destroy(Workspace $workspace, int $id): RedirectResponse
    {
        $transaction = $this->transactionService->findOrFail($id);

        abort_unless($transaction->type === TransactionType::EXPENSE, 404);

        $this->transactionService->delete($transaction);

        return back()->with('success', 'Pengeluaran berhasil dihapus.');
    }

    private function formProps(Workspace $workspace): array
    {
        return [
            'workspace' => $this->workspacePayload($workspace),
            'wallets' => $this->walletService->listActive(),
            'categories' => $this->categoryService->listByType(CategoryType::EXPENSE->value),
        ];
    }

    private function toCreateData(StoreTransactionRequest $request): CreateTransactionData
    {
        return new CreateTransactionData(
            walletId: $request->integer('wallet_id'),
            categoryId: $request->integer('category_id'),
            type: TransactionType::EXPENSE,
            amount: (float) $request->input('amount'),
            transactionDate: $request->string('transaction_date')->toString(),
            title: $request->string('title')->toString(),
            description: $request->input('description'),
            referenceNo: $request->input('reference_number'),
        );
    }

    private function toUpdateData(UpdateTransactionRequest $request): UpdateTransactionData
    {
        return new UpdateTransactionData(
            categoryId: $request->integer('category_id'),
            type: TransactionType::EXPENSE,
            amount: (float) $request->input('amount'),
            transactionDate: $request->string('transaction_date')->toString(),
            title: $request->string('title')->toString(),
            description: $request->input('description'),
            referenceNo: $request->input('reference_number'),
        );
    }
}
