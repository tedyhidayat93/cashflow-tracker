<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Builder;

class Service extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'short_description',
        'sku',
        'price',
        'compare_at_price',
        'duration',
        'image',
        'status',
        'is_featured',
        'category_id',
        'meta_title',
        'meta_description',
        'is_active',
        'sequence',
    ];

    protected $casts = [
        'price' => 'integer',
        'compare_at_price' => 'integer',
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
        'sequence' => 'integer',
        'deleted_at' => 'datetime',
    ];

    // Relationships
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function tags()
    {
        return $this->belongsToMany(Tag::class)
            ->whereIn('type', ['service', 'common']);
    }

    // Scopes
    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeOfCategory($query, $categoryId)
    {
        return $query->where('category_id', $categoryId);
    }

    /**
     * Get all services for footer
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public static function getAllForFooter()
    {
        return self::where('is_active', true)
            ->orderBy('sequence', 'asc')
            // ->orderBy('name', 'asc')
            ->get();
    }
}
