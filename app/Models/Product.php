<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Arr;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'slug',
        'type',
        'description',
        'short_description',
        'sku',
        'price',
        'compare_at_price',
        'cost_per_item',
        'track_quantity',
        'quantity',
        'barcode',
        'status',
        'is_featured',
        'is_bestseller',
        'is_new',
        'is_for_sell',
        'is_rent',
        'show_price',
        'show_stock',
        'published_at',
        'position',
        'brand_id',
        'category_id',
        'meta_title',
        'meta_description',
        'views',
        'tags',
        'specific_specs',
    ];

    protected $casts = [
        'price' => 'integer',
        'compare_at_price' => 'integer',
        'cost_per_item' => 'integer',
        'track_quantity' => 'boolean',
        'is_featured' => 'boolean',
        'is_bestseller' => 'boolean',
        'is_new' => 'boolean',
        'is_for_sell' => 'boolean',
        'is_rent' => 'boolean',
        'show_price' => 'boolean',
        'show_stock' => 'boolean',
        'published_at' => 'datetime',
        'deleted_at' => 'datetime',
        'tags' => 'array',
        'specific_specs' => 'array',
        'position' => 'integer',
        'views' => 'integer',
    ];

    protected $attributes = [
        'tags' => '[]',
        'views' => 0,
    ];

    // Relationships
    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function images()
    {
        return $this->hasMany(ProductImage::class);
    }

    public function coverImage()
    {
        return $this->hasOne(ProductImage::class)->where('is_cover', true);
    }

    /**
     * Get the tags as an array.
     *
     * @return array
     */
    public function getTagsAttribute($value)
    {
        return json_decode($value, true) ?? [];
    }

    /**
     * Get the processed image path for the cover image.
     *
     * @return string
     */
    public function getImagePathAttribute()
    {
        if (!isset($this->attributes['image_path'])) {
            $coverImagePath = $this->coverImage?->image_path;
            if ($coverImagePath && !str_starts_with($coverImagePath, '/storage/')) {
                $coverImagePath = '/storage/' . ltrim($coverImagePath, '/');
            } elseif (!$coverImagePath) {
                $coverImagePath = '/images/placeholder-product.svg';
            }
            
            // Check if the image file actually exists
            $fullPath = public_path($coverImagePath);
            if (!file_exists($fullPath)) {
                $coverImagePath = '/images/placeholder-product.svg';
            }
            
            $this->attributes['image_path'] = $coverImagePath;
        }
        
        return $this->attributes['image_path'];
    }

    /**
     * Set the tags as a JSON string.
     *
     * @param  array|string  $value
     * @return void
     */
    public function setTagsAttribute($value)
    {
        $this->attributes['tags'] = is_array($value) ? json_encode(array_values(array_unique($value))) : $value;
    }

    /**
     * Check if the product has a specific tag.
     *
     * @param  string  $tag
     * @return bool
     */
    public function hasTag($tag)
    {
        return in_array($tag, $this->tags);
    }

    /**
     * Add a tag to the product.
     *
     * @param  string  $tag
     * @return void
     */
    public function addTag($tag)
    {
        $tags = $this->tags;
        if (!in_array($tag, $tags)) {
            $tags[] = $tag;
            $this->tags = $tags;
        }
    }

    /**
     * Remove a tag from the product.
     *
     * @param  string  $tag
     * @return void
     */
    public function removeTag($tag)
    {
        $tags = $this->tags;
        $key = array_search($tag, $tags);
        if ($key !== false) {
            unset($tags[$key]);
            $this->tags = array_values($tags); // Re-index array
        }
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

    public function scopeBestseller($query)
    {
        return $query->where('is_bestseller', true);
    }

    public function scopeNew($query)
    {
        return $query->where('is_new', true);
    }

    public function scopeForSell($query)
    {
        return $query->where('is_for_sell', true);
    }

    public function scopeForRent($query)
    {
        return $query->where('is_rent', true);
    }

    public function scopeOfType($query, $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Get 5 bestseller products for footer
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public static function getBestsellerForFooter()
    {
        return self::published()
            ->bestseller()
            ->where('is_featured', true)
            ->with(['brand', 'category', 'coverImage'])
            ->orderBy('position', 'asc')
            ->orderBy('created_at', 'desc')
            ->take(8)
            ->get()
            ->shuffle();
    }
}
