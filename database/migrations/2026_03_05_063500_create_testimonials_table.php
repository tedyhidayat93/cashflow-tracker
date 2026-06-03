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
        Schema::create('testimonials', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->string('keterangan')->nullable();
            $table->string('perusahaan')->nullable();
            $table->string('foto_avatar')->nullable();
            $table->tinyInteger('rate_star')->unsigned()->default(5);
            $table->text('testimoni');
            $table->boolean('is_show_public')->default(true);
            $table->integer('sequence')->default(0);
            $table->timestamps();
            $table->softDeletes();

            // Indexes
            $table->index('is_show_public');
            $table->index('rate_star');
            $table->index('sequence');
            $table->index('deleted_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('testimonials');
    }
};
