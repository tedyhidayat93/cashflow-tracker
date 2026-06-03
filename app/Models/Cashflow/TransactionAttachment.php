<?php

namespace App\Models\Cashflow;

use App\Models\Cashflow\BaseModel;

class TransactionAttachment extends BaseModel
{
    protected $table = 'cf_transaction_attachments';

    protected $guarded = [
        'id',
        'workspace_id',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    protected $fillable = [
        'workspace_id',
        'transaction_id',
        'disk',
        'path',
        'file_name',
        'original_name',
        'mime_type',
        'extension',
        'size',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'size' => 'integer',
    ];

    protected $appends = [
        'file_url',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function transaction()
    {
        return $this->belongsTo(
            Transaction::class
        );
    }

    public function attachments()
    {
        return $this->hasMany(
            TransactionAttachment::class
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Accessors
    |--------------------------------------------------------------------------
    */

    public function getFileUrlAttribute(): string
    {
        return Storage::disk(
            $this->disk
        )->url(
            $this->path
        );
    }
}