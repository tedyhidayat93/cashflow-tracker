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
        Schema::create('cf_wallets', function (Blueprint $table) {
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
            | Wallet Information
            |--------------------------------------------------------------------------
            */
            $table->string('name');

            $table->enum('type', [
                'cash',
                'bank',
                'ewallet',
                'credit_card',
                'investment',
            ]);

            /*
            |--------------------------------------------------------------------------
            | Financial
            |--------------------------------------------------------------------------
            */
            $table->decimal('opening_balance', 18, 2)
                ->default(0);

            $table->decimal('current_balance', 18, 2)
                ->default(0);

            $table->string('currency', 10)
                ->default('IDR');

            /*
            |--------------------------------------------------------------------------
            | Additional Information
            |--------------------------------------------------------------------------
            */
            $table->string('account_number')
                ->nullable();

            $table->string('bank_name')
                ->nullable();

            $table->string('icon')
                ->nullable();

            $table->string('color', 20)
                ->nullable();

            $table->text('description')
                ->nullable();

            /*
            |--------------------------------------------------------------------------
            | Status
            |--------------------------------------------------------------------------
            */
            $table->boolean('is_active')
                ->default(true);

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
            $table->index('type');
            $table->index('is_active');

            /*
            |--------------------------------------------------------------------------
            | Unique Wallet Name Per Workspace
            |--------------------------------------------------------------------------
            */
            $table->unique([
                'workspace_id',
                'name',
            ], 'cf_wallets_workspace_name_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cf_wallets');
    }
};