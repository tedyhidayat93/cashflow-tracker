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
        Schema::table('permissions', function (Blueprint $table) {
            $table->string('type')->default('system')->after('id'); // see: app/Enums/SystemScopeIdentifierType.php
            $table->string('code')->nullable()->after('type');
            $table->string('app_prefix')->nullable()->after('code');  // for app module (ex: cashflow, crm, etc) if null is for system. see: app/Enums/AppIdentifier.php
            
            $table->text('group_name')->nullable()->after('app_prefix');  // for grouping permissions in UI
            $table->text('description')->nullable()->after('guard_name');
            $table->boolean('is_default')->default(false)->after('description');       // For MyISAM use string('name', 225); // (or 166 for InnoDB with Redundant/Compact row format)
            $table->boolean('is_active')->default(true)->after('is_default');

            $table->index('type');
            $table->index('app_prefix');
            $table->index('is_active');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('permissions', function (Blueprint $table) {
            $table->dropIndex(['is_active','app_prefix', 'is_active']);
            $table->dropColumn(['description', 'is_active', 'type', 'code','app_prefix','is_default']);
        });
    }
};
