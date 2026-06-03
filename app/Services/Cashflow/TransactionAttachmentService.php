<?php

namespace App\Services\Cashflow;

use App\Models\Cashflow\Transaction;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use App\Models\Cashflow\TransactionAttachment;
use App\DTOs\Cashflow\TransactionAttachment\CreateTransactionAttachmentData;
use App\DTOs\Cashflow\TransactionAttachment\UpdateTransactionAttachmentData;

class TransactionAttachmentService extends BaseService
{
    protected string $disk = 'public';

    public function create(
        CreateTransactionAttachmentData $data
    ): TransactionAttachment {

        return DB::transaction(function () use ($data) {

            $transaction = Transaction::workspace()
                ->findOrFail(
                    $data->transactionId
                );

            $file = $data->file;

            $path = $file->store(
                'cashflow/transactions',
                $this->disk
            );

            $attachment = TransactionAttachment::create([
                'transaction_id' => $transaction->id,

                'disk' => $this->disk,

                'path' => $path,

                'file_name' => basename($path),

                'original_name' => $file->getClientOriginalName(),

                'mime_type' => $file->getMimeType(),

                'extension' => $file->getClientOriginalExtension(),

                'size' => $file->getSize(),
            ]);

            $this->activityLogService->custom(
                event: 'transaction.attachment.created',
                subject: $transaction,
                description: "Menambahkan lampiran transaksi"
            );

            return $attachment;
        });
    }

    public function replace(
        TransactionAttachment $attachment,
        UpdateTransactionAttachmentData $data
    ): TransactionAttachment {

        return DB::transaction(function () use (
            $attachment,
            $data
        ) {

            if (
                Storage::disk($attachment->disk)
                    ->exists($attachment->path)
            ) {
                Storage::disk($attachment->disk)
                    ->delete($attachment->path);
            }

            $file = $data->file;

            $path = $file->store(
                'cashflow/transactions',
                $this->disk
            );

            $attachment->update([
                'disk' => $this->disk,

                'path' => $path,

                'file_name' => basename($path),

                'original_name' => $file->getClientOriginalName(),

                'mime_type' => $file->getMimeType(),

                'extension' => $file->getClientOriginalExtension(),

                'size' => $file->getSize(),
            ]);

            $this->activityLogService->custom(
                event: 'transaction.attachment.updated',
                subject: $attachment->transaction,
                description: 'Mengubah lampiran transaksi'
            );

            return $attachment->fresh();
        });
    }

    public function delete(
        TransactionAttachment $attachment
    ): void {

        DB::transaction(function () use ($attachment) {

            if (
                Storage::disk($attachment->disk)
                    ->exists($attachment->path)
            ) {
                Storage::disk($attachment->disk)
                    ->delete($attachment->path);
            }

            $this->activityLogService->custom(
                event: 'transaction.attachment.deleted',
                subject: $attachment->transaction,
                description: 'Menghapus lampiran transaksi'
            );

            $attachment->update([
                'deleted_by' => current_user_id(),
            ]);

            $attachment->delete();
        });
    }
}