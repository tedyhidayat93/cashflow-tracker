<?php

namespace App\Console\Commands;

use Throwable;
use Illuminate\Console\Command;

use App\Models\Cashflow\RecurringTransaction;

use App\Enums\Cashflow\RecurringStatus;

use App\Services\Cashflow\RecurringTransactionService;

class ProcessRecurringTransactions extends Command
{
    protected $signature =
        'cashflow:process-recurring-transactions';

    protected $description =
        'Memproses seluruh recurring transaction yang sudah jatuh tempo';

    public function __construct(
        protected RecurringTransactionService $recurringService
    ) {
        parent::__construct();
    }

    public function handle(): int
    {
        $this->info(
            'Memulai proses recurring transactions...'
        );

        $processed = 0;
        $failed = 0;

        RecurringTransaction::query()
            ->where(
                'status',
                RecurringStatus::ACTIVE
            )
            ->whereNotNull(
                'next_execution_at'
            )
            ->where(
                'next_execution_at',
                '<=',
                now()
            )
            ->chunkById(
                100,
                function ($recurrings) use (
                    &$processed,
                    &$failed
                ) {

                    foreach (
                        $recurrings as $recurring
                    ) {

                        try {

                            $this->recurringService
                                ->process(
                                    $recurring
                                );

                            $processed++;

                            $this->line(
                                sprintf(
                                    '[OK] #%s - %s',
                                    $recurring->id,
                                    $recurring->title
                                )
                            );

                        } catch (Throwable $e) {

                            $failed++;

                            report($e);

                            $this->error(
                                sprintf(
                                    '[FAILED] #%s - %s',
                                    $recurring->id,
                                    $e->getMessage()
                                )
                            );
                        }
                    }
                }
            );

        $this->newLine();

        $this->info(
            sprintf(
                'Selesai. Berhasil: %s | Gagal: %s',
                $processed,
                $failed
            )
        );

        return self::SUCCESS;
    }
}