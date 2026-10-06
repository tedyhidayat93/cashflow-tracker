<?php

namespace App\Models;

use App\Models\User;
use App\Models\WorkspaceApp; // Sesuaikan namespace model WorkspaceApp Anda
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Workspace extends Model
{
    protected $table = 'workspaces';
    
    protected $fillable = [
        'owner_id',
        'name',
        'slug',
        'logo',
        'description',
        'currency',
        'timezone',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Relasi ke Pemilik Utama Workspace
     */
    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    /**
     * Relasi ke Aplikasi yang terdaftar/diaktifkan di Workspace ini (Multi-App Pivot)
     */
    public function apps(): HasMany
    {
        return $this->hasMany(WorkspaceApp::class, 'workspace_id');
    }

    /**
     * Helper untuk mengecek apakah workspace memiliki akses ke app tertentu
     */
    public function hasApp(string $appPrefix): bool
    {
        return $this->apps()
            ->where('app_prefix', $appPrefix)
            ->where('is_active', true)
            ->exists();
    }

    /**
     * Relasi pivot langsung ke WorkspaceUser
     */
    public function workspaceUsers(): HasMany
    {
        return $this->hasMany(WorkspaceUser::class, 'workspace_id');
    }

    /**
     * Relasi Many-to-Many ke User yang terdaftar di Workspace ini
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(
            User::class,
            'workspace_users',
            'workspace_id',
            'user_id'
        )
        ->withPivot([
            'joined_at',
            'is_active',
            'invited_by',
        ])
        ->withTimestamps();
    }
}