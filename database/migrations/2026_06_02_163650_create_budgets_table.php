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
        Schema::create('cf_budgets', function (Blueprint $table) {
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
            | Category
            |--------------------------------------------------------------------------
            */
            $table->foreignId('category_id')
                ->constrained('cf_categories')
                ->cascadeOnDelete();

            /*
            |--------------------------------------------------------------------------
            | Budget Information
            |--------------------------------------------------------------------------
            */
            $table->string('name');

            $table->decimal('amount', 18, 2);

            /*
            |--------------------------------------------------------------------------
            | Period
            |--------------------------------------------------------------------------
            */
            $table->enum('period', [
                'monthly',
                'quarterly',
                'yearly',
                'custom',
            ])->default('monthly');

            $table->date('start_date');

            $table->date('end_date');

            /*
            |--------------------------------------------------------------------------
            | Settings
            |--------------------------------------------------------------------------
            */
            $table->boolean('is_rollover')
                ->default(false);

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
            $table->index('category_id');
            $table->index('period');
            $table->index('start_date');
            $table->index('end_date');
            $table->index('is_active');

            /*
            |--------------------------------------------------------------------------
            | Unique Budget
            |--------------------------------------------------------------------------
            */
            $table->unique([
                'workspace_id',
                'category_id',
                'start_date',
                'end_date',
            ], 'cf_budgets_unique_period');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cf_budgets');
    }
};