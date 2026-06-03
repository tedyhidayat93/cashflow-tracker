<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cf_activity_logs', function (Blueprint $table) {
            $table->id();

            /*
            |--------------------------------------------------------------------------
            | Workspace
            |--------------------------------------------------------------------------
            */
            $table->foreignId('workspace_id')
                ->nullable()
                ->constrained('cf_workspaces')
                ->nullOnDelete();

            /*
            |--------------------------------------------------------------------------
            | User
            |--------------------------------------------------------------------------
            */
            $table->foreignId('user_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();

            /*
            |--------------------------------------------------------------------------
            | Activity
            |--------------------------------------------------------------------------
            */
            $table->string('event');

            $table->string('subject_type')
                ->nullable();

            $table->unsignedBigInteger('subject_id')
                ->nullable();

            /*
            |--------------------------------------------------------------------------
            | Description
            |--------------------------------------------------------------------------
            */
            $table->text('description')
                ->nullable();

            /*
            |--------------------------------------------------------------------------
            | Changes
            |--------------------------------------------------------------------------
            */
            $table->json('properties')
                ->nullable();

            /*
            |--------------------------------------------------------------------------
            | Request Info
            |--------------------------------------------------------------------------
            */
            $table->ipAddress('ip_address')
                ->nullable();

            $table->text('user_agent')
                ->nullable();

            /*
            |--------------------------------------------------------------------------
            | Metadata
            |--------------------------------------------------------------------------
            */
            $table->json('metadata')
                ->nullable();

            $table->timestamps();

            /*
            |--------------------------------------------------------------------------
            | Indexes
            |--------------------------------------------------------------------------
            */
            $table->index('workspace_id');
            $table->index('user_id');
            $table->index('event');

            $table->index([
                'subject_type',
                'subject_id',
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cf_activity_logs');
    }
};