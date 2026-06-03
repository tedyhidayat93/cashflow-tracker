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
        Schema::table('products', function (Blueprint $table) {
            // Change price fields to have more precision for larger values
            $table->decimal('price', 30, 2)->change();
            $table->decimal('compare_at_price', 30, 2)->nullable()->change();
            $table->decimal('cost_per_item', 30, 2)->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            // Revert to original precision
            $table->decimal('price', 12, 2)->change();
            $table->decimal('compare_at_price', 12, 2)->nullable()->change();
            $table->decimal('cost_per_item', 12, 2)->nullable()->change();
        });
    }
};
