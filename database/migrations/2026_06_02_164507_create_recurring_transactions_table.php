<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cf_recurring_transactions', function (Blueprint $table) {
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
            | Transaction Template
            |--------------------------------------------------------------------------
            */
            $table->enum('type', [
                'income',
                'expense',
            ]);

            $table->string('title');

            $table->decimal('amount', 18, 2);

            $table->text('description')
                ->nullable();

            /*
            |--------------------------------------------------------------------------
            | Schedule
            |--------------------------------------------------------------------------
            */
            $table->enum('frequency', [
                'daily',
                'weekly',
                'monthly',
                'yearly',
            ]);

            /*
            |--------------------------------------------------------------------------
            | Monthly
            |--------------------------------------------------------------------------
            */
            $table->unsignedTinyInteger('day_of_month')
                ->nullable();

            /*
            |--------------------------------------------------------------------------
            | Weekly
            |--------------------------------------------------------------------------
            */
            $table->unsignedTinyInteger('day_of_week')
                ->nullable();

            /*
            |--------------------------------------------------------------------------
            | Period
            |--------------------------------------------------------------------------
            */
            $table->date('start_date');

            $table->date('end_date')
                ->nullable();

            /*
            |--------------------------------------------------------------------------
            | Execution
            |--------------------------------------------------------------------------
            */
            $table->date('last_executed_at')
                ->nullable();

            $table->date('next_execution_at')
                ->nullable();

            /*
            |--------------------------------------------------------------------------
            | Settings
            |--------------------------------------------------------------------------
            */
            $table->boolean('is_active')
                ->default(true);

            /*
            |--------------------------------------------------------------------------
            | Metadata
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
            $table->index('frequency');
            $table->index('next_execution_at');
            $table->index('is_active');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cf_recurring_transactions');
    }
};