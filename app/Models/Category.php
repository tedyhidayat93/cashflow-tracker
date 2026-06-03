<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Builder;

class Category extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'image',
        'type',
        'parent_id',
        'lft',
        'rgt',
        'depth',
        'is_active',
        'meta_title',
        'meta_description',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'lft' => 'integer',
        'rgt' => 'integer',
        'depth' => 'integer',
        'deleted_at' => 'datetime',
    ];

    // Relationships
    public function parent()
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Category::class, 'parent_id')
            ->with('children'); // 🔥 recursion
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    public function services()
    {
        return $this->hasMany(Service::class);
    }

    public function articles()
    {
        return $this->hasMany(Article::class);
    }

    // Scopes
    public function scopeOfType(Builder $query, string $type)
    {
        return $query->where('type', $type);
    }

    public function scopeActive(Builder $query)
    {
        return $query->where('is_active', true);
    }

    public function scopeRoot(Builder $query)
    {
        return $query->whereNull('parent_id');
    }

    // Helpers
    public function isChildOf(Category $category): bool
    {
        return $this->parent_id === $category->id;
    }

    public function isRoot(): bool
    {
        return is_null($this->parent_id);
    }

    /**
     * Get category hierarchy as string (parent > child > grandchild)
     *
     * @return string
     */
    public function getHierarchy(): string
    {
        $ancestors = [];
        $current = $this;

        // Build hierarchy from top to bottom
        while ($current) {
            array_unshift($ancestors, $current->name);
            $current = $current->parent;
        }

        return implode(' > ', $ancestors);
    }

    /**
     * Get category hierarchy as string for a given category instance
     * Static method for backward compatibility
     *
     * @param mixed $category Category model instance
     * @return string
     */
    public static function getHierarchyStatic($category): string
    {
        if (!$category) {
            return 'Uncategorized';
        }

        $ancestors = [];
        $current = $category;

        // Build hierarchy from top to bottom
        while ($current) {
            array_unshift($ancestors, $current->name);
            $current = $current->parent;
        }

        return implode(' > ', $ancestors);
    }
}
