<?php

namespace App\Models;

use App\Models\Workspace;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WorkspaceApp extends Model
{
    protected $table = 'workspace_apps';

    protected $fillable = [
        'workspace_id',
        'app_prefix',
        'is_active',
        'subscribed_at',
        'expires_at',
    ];

    protected $casts = [
        'is_active'     => 'boolean',
        'subscribed_at' => 'datetime',
        'expires_at'    => 'datetime',
    ];

    /**
     * Relasi kembali ke Workspace pemilik
     */
    public function workspace(): BelongsTo
    {
        return $this->belongsTo(Workspace::class, 'workspace_id');
    }

    /**
     * Scope untuk memfilter aplikasi yang statusnya aktif & masa berlangganannya belum expired
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true)
            ->where(function ($q) {
                $q->whereNull('expires_at')
                  ->orWhere('expires_at', '>', now());
            });
    }

    /**
     * Helper untuk mengecek apakah langganan aplikasi ini masih berlaku
     */
    public function isValidSubscription(): bool
    {
        if (!$this->is_active) {
            return false;
        }

        if ($this->expires_at && $this->expires_at->isPast()) {
            return false;
        }

        return true;
    }
}