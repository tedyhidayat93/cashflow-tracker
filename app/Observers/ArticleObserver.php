<?php

namespace App\Observers;

use App\Models\Article;
use Illuminate\Support\Facades\Cache;

class ArticleObserver
{
    /*
    |--------------------------------------------------------------------------
    | CREATED
    |--------------------------------------------------------------------------
    */

    public function created(
        Article $article
    ): void {

        $this->clearCaches();
    }

    /*
    |--------------------------------------------------------------------------
    | UPDATED
    |--------------------------------------------------------------------------
    */

    public function updated(
        Article $article
    ): void {

        $this->clearCaches();
    }

    /*
    |--------------------------------------------------------------------------
    | DELETED
    |--------------------------------------------------------------------------
    */

    public function deleted(
        Article $article
    ): void {

        $this->clearCaches();
    }

    /*
    |--------------------------------------------------------------------------
    | RESTORED
    |--------------------------------------------------------------------------
    */

    public function restored(
        Article $article
    ): void {

        $this->clearCaches();
    }

    /*
    |--------------------------------------------------------------------------
    | FORCE DELETED
    |--------------------------------------------------------------------------
    */

    public function forceDeleted(
        Article $article
    ): void {

        $this->clearCaches();
    }

    /*
    |--------------------------------------------------------------------------
    | CLEAR CACHE
    |--------------------------------------------------------------------------
    */

    private function clearCaches(): void
    {
        Cache::forget('homepage.articles');
        Cache::forget('shared.footer.articles');
    }
}