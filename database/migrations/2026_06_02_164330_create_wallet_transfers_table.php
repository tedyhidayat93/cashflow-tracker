<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('cf_wallet_transfers', function (Blueprint $table) {
            $table->id();

            /*
            |--------------------------------------------------------------------------
            | Workspace
            |--------------------------------------------------------------------------
            */
            $table->foreignId('workspace_id')
                ->constrained('cf_workspaces')
                ->cascadeOnDelete();

            /*
            |--------------------------------------------------------------------------
            | Source Wallet
            |--------------------------------------------------------------------------
            */
            $table->foreignId('from_wallet_id')
                ->constrained('cf_wallets')
                ->restrictOnDelete();

            /*
            |--------------------------------------------------------------------------
            | Destination Wallet
            |--------------------------------------------------------------------------
            */
            $table->foreignId('to_wallet_id')
                ->constrained('cf_wallets')
                ->restrictOnDelete();

            /*
            |--------------------------------------------------------------------------
            | Transfer Information
            |--------------------------------------------------------------------------
            */
            $table->decimal('amount', 18, 2);

            $table->decimal('fee', 18, 2)
                ->default(0);

            $table->string('reference_number')
                ->nullable();

            $table->string('title')
                ->nullable();

            $table->text('description')
                ->nullable();

            /*
            |--------------------------------------------------------------------------
            | Transfer Date
            |--------------------------------------------------------------------------
            */
            $table->date('transfer_date');

            /*
            |--------------------------------------------------------------------------
            | Metadata
            |--------------------------------------------------------------------------
            */
            $table->json('metadata')
                ->nullable();


            /*
            |--------------------------------------------------------------------------
            | Additional Fields for Linking to Transactions
            |--------------------------------------------------------------------------
            */
            $table->foreignId('expense_transaction_id')
                ->nullable()
                ->constrained('cf_transactions')
                ->nullOnDelete();

            $table->foreignId('income_transaction_id')
                ->nullable()
                ->constrained('cf_transactions')
                ->nullOnDelete();

            $table->foreignId('fee_transaction_id')
                ->nullable()
                ->constrained('cf_transactions')
                ->nullOnDelete();

            /*
            |--------------------------------------------------------------------------
            | Audit
            |--------------------------------------------------------------------------
            */
            $table->foreignId('created_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->foreignId('updated_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->timestamps();
            $table->softDeletes();

            /*
            |--------------------------------------------------------------------------
            | Indexes
            |--------------------------------------------------------------------------
            */
            $table->index('workspace_id');
            $table->index('from_wallet_id');
            $table->index('to_wallet_id');
            $table->index('transfer_date');
            $table->index('created_by');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cf_wallet_transfers');
    }
};