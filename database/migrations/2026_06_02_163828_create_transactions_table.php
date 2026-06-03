<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cf_transactions', function (Blueprint $table) {
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
            | Relations
            |--------------------------------------------------------------------------
            */
            $table->foreignId('wallet_id')
                ->constrained('cf_wallets')
                ->restrictOnDelete();

            $table->foreignId('category_id')
                ->constrained('cf_categories')
                ->restrictOnDelete();

            /*
            |--------------------------------------------------------------------------
            | Transaction
            |--------------------------------------------------------------------------
            */
            $table->enum('type', [
                'income',
                'expense',
            ]);

            $table->decimal('amount', 18, 2);

            $table->string('title');

            $table->text('description')
                ->nullable();

            /*
            |--------------------------------------------------------------------------
            | Reference
            |--------------------------------------------------------------------------
            */
            $table->string('reference_number')
                ->nullable();

            /*
            |--------------------------------------------------------------------------
            | Transaction Date
            |--------------------------------------------------------------------------
            */
            $table->date('transaction_date');

            /*
            |--------------------------------------------------------------------------
            | Future Ready
            |--------------------------------------------------------------------------
            */
            $table->json('metadata')
                ->nullable();

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
            $table->index('wallet_id');
            $table->index('category_id');
            $table->index('type');
            $table->index('transaction_date');
            $table->index('created_by');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cf_transactions');
    }
};