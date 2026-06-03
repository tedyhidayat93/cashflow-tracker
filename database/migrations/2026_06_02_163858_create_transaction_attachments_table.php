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
        Schema::create('cf_transaction_attachments', function (Blueprint $table) {
            $table->id();

            $table->foreignId('workspace_id')
                ->constrained('cf_workspaces')
                ->cascadeOnDelete();

            $table->foreignId('transaction_id')
                ->constrained('cf_transactions')
                ->cascadeOnDelete();

            $table->string('disk')
                ->nullable();
            
            $table->string('path')
                ->nullable();

            $table->string('file_name');

            $table->string('original_name')
                ->nullable();

            $table->string('mime_type')
                ->nullable();

            $table->string('extension')
                ->nullable();


            $table->unsignedBigInteger('size')
                ->nullable();

            $table->timestamps();

            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cf_transaction_attachments');
    }
};
