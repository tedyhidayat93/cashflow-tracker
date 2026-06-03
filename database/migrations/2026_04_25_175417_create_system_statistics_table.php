<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('system_statistics', function (Blueprint $table) {
            $table->id();
            // Gunakan date sebagai unique agar satu hari hanya ada satu baris data
            $table->date('date')->unique(); 
            
            // Core Traffic (Minimalis)
            $table->integer('total_visitors')->default(0);
            $table->integer('page_views')->default(0);
            
            // Device Distribution (Simpan dalam satu kolom JSON saja lebih hemat)
            // Contoh isi: {"pc": 100, "phone": 50, "tablet": 10}
            $table->json('device_stats')->nullable(); 

            // Location Stats (Simpan top cities/countries)
            // Contoh isi: {"Jakarta": 40, "Surabaya": 20}
            $table->json('geo_stats')->nullable();

            // Page Stats (Simpan view per halaman)
            // Contoh isi: {"/home": 100, "/produk/1": 25}
            $table->json('page_stats')->nullable();

            // Business Metrics (Penting untuk laporan)
            $table->integer('orders_count')->default(0);
            $table->integer('inquiries_count')->default(0);

            $table->timestamps();

            // Indexing untuk pencarian cepat berdasarkan range tanggal
            $table->index('date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('system_statistics');
    }
};