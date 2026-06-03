<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Builder;

class Article extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'slug',
        'content',
        'excerpt',
        'featured_image',
        'status',
        'published_at',
        'author_id',
        'category_id',
        'meta_title',
        'meta_description',
        'meta_keywords',
        'views_count',
        'tags',
        'position',
        'is_headline',
        'views',
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'deleted_at' => 'datetime',
        'tags' => 'array',
        'position' => 'integer',
        'is_headline' => 'boolean',
        'views' => 'integer',
        'category_id' => 'integer',
    ];

    protected $attributes = [
        'tags' => '[]',
        'views' => 0,
    ];

    // Relationships
    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    /**
     * Check if the article has a specific tag.
     *
     * @param  string  $tag
     * @return bool
     */
    public function hasTag($tag)
    {
        return in_array($tag, $this->tags);
    }

    /**
     * Add a tag to the article.
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
     * Remove a tag from the article.
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

    public function scopeDraft($query)
    {
        return $query->where('status', 'draft');
    }

    public function scopeArchived($query)
    {
        return $query->where('status', 'archived');
    }

    public function scopePopular($query, $days = 30)
    {
        return $query->where('published_at', '>=', now()->subDays($days))
            ->orderBy('views_count', 'desc');
    }

    public function scopeHeadline($query)
    {
        return $query->where('is_headline', true);
    }

    public function scopeWithTags($query, array $tags)
    {
        return $query->where(function ($query) use ($tags) {
            foreach ($tags as $tag) {
                $query->orWhereJsonContains('tags', $tag);
            }
        });
    }

    public function scopeWithTag($query, string $tag)
    {
        return $query->whereJsonContains('tags', $tag);
    }

    /**
     * Get 5 most read articles for footer
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public static function getMostReadForFooter()
    {
        return self::published()
            ->orderBy('views_count', 'desc')
            ->orderBy('published_at', 'desc')
            ->take(6)
            ->get();
    }
}
