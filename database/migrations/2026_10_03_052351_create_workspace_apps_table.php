<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('workspace_apps', function (Blueprint $table) {
            $table->id();
            $table->foreignId('workspace_id')->constrained()->onDelete('cascade');
            
            // Menyimpan identifier aplikasi (misal: 'cashflow', 'inventory', dll)
            $table->string('app_prefix'); 
            
            $table->boolean('is_active')->default(true);
            $table->timestamp('subscribed_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();

            // Mencegah duplikasi aplikasi yang sama di satu workspace
            $table->unique(['workspace_id', 'app_prefix']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('workspace_apps');
    }
};