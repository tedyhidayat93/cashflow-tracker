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
        Schema::create('configurations', function (Blueprint $table) {
            $table->id();
            $table->string('label');
            $table->string('description')->nullable();
            $table->enum('group', ['site', 'email', 'system', 'payment', 'shipping', 'other'])->default('other');
            $table->string('key');
            $table->string('value');
            $table->enum('type', ['text', 'number', 'select', 'checkbox', 'radio', 'file', 'image', 'textarea', 'wysiwyg', 'other'])->default('text');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('configurations');
    }
};
