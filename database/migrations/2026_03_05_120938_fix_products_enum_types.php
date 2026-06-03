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
            // Fix type enum to match frontend and validation
            $table->enum('type', ['physical', 'digital'])->default('physical')->change();
            
            // Fix status enum to match frontend and validation  
            $table->enum('status', ['draft', 'published'])->default('draft')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            // Revert to original values
            $table->enum('type', ['sell_only', 'rent_only', 'rent_sell'])->default('sell_only')->change();
            $table->enum('status', ['draft', 'active', 'archived'])->default('draft')->change();
        });
    }
};
