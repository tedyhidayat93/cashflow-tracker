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
            $table->bigInteger('price')->nullable()->change();
            $table->bigInteger('compare_at_price')->nullable()->change();
            $table->bigInteger('cost_per_item')->nullable()->change();
        });

        Schema::table('services', function (Blueprint $table) {
            $table->bigInteger('price')->nullable()->change();
            $table->bigInteger('compare_at_price')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->decimal('price', 12, 2)->nullable()->change();
            $table->decimal('compare_at_price', 12, 2)->nullable()->change();
            $table->decimal('cost_per_item', 12, 2)->nullable()->change();
        });

        Schema::table('services', function (Blueprint $table) {
            $table->decimal('price', 15, 2)->nullable()->change();
            $table->decimal('compare_at_price', 15, 2)->nullable()->change();
        });
    }
};
