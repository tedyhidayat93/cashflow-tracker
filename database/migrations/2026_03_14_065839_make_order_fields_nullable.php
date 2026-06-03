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
        Schema::table('orders', function (Blueprint $table) {
            // Make address fields nullable
            $table->string('address')->nullable()->change();
            $table->string('province')->nullable()->change();
            $table->string('regency')->nullable()->change();
            $table->string('district')->nullable()->change();
            $table->string('village')->nullable()->change();
            $table->string('postal_code')->nullable()->change();
            
            // Make other fields nullable
            $table->string('company_name')->nullable()->change();
            $table->string('pic_name')->nullable()->change();
            $table->string('phone')->nullable()->change();
            $table->string('email')->nullable()->change();
            $table->text('notes')->nullable()->change();
            $table->text('admin_notes')->nullable()->change();
            
            // Make product fields nullable
            $table->string('product_category')->nullable()->change();
            $table->string('product_image')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            // Revert to not nullable (if needed)
            $table->string('address')->nullable(false)->change();
            $table->string('province')->nullable(false)->change();
            $table->string('regency')->nullable(false)->change();
            $table->string('district')->nullable(false)->change();
            $table->string('village')->nullable(false)->change();
            $table->string('postal_code')->nullable(false)->change();
            
            $table->string('company_name')->nullable(false)->change();
            $table->string('pic_name')->nullable(false)->change();
            $table->string('phone')->nullable(false)->change();
            $table->string('email')->nullable(false)->change();
            $table->text('notes')->nullable(false)->change();
            $table->text('admin_notes')->nullable(false)->change();
            
            $table->string('product_category')->nullable(false)->change();
            $table->string('product_image')->nullable(false)->change();
        });
    }
};
