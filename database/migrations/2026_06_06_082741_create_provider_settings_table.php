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
        Schema::create('provider_settings', function (Blueprint $table) {
            $table->id();

            $table->foreignId('provider_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->string('label');

            $table->string('key')->unique();

            $table->string('type')->default('text');
            
            $table->longText('value')->nullable();
            
            $table->string('default_value')->nullable();
            
            $table->string('description')->nullable();

            $table->json('options')->nullable();

            $table->boolean('is_required')->default(false);

            $table->boolean('is_public')->default(false);

            $table->boolean('is_encrypted')->default(false);

            $table->integer('sort_order')->default(0);


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

            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('provider_settings');
    }
};
