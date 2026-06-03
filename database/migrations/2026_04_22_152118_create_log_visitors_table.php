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
        Schema::create('log_visitors', function (Blueprint $table) {
            $table->id();
            $table->string('action')->nullable();
            $table->string('page')->nullable();
            $table->text('message')->nullable();
            $table->string('ip_address')->nullable();
            $table->string('provider')->nullable();
            $table->enum('device', ['phone', 'tablet', 'pc'])->nullable();
            $table->text('user_agent')->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->string('city')->nullable();
            $table->string('region')->nullable();
            $table->string('country')->nullable();
            $table->string('url_path')->nullable();
            $table->string('http_method')->nullable();
            $table->timestamp('timestamp')->useCurrent();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('log_visitors');
    }
};
