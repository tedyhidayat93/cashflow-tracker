<?php

namespace App\Observers;

use App\Models\Product;
use Illuminate\Support\Facades\Cache;

class ProductObserver
{
    /*
    |--------------------------------------------------------------------------
    | CREATED
    |--------------------------------------------------------------------------
    */

    public function created(
        Product $product
    ): void {

        $this->clearHomepageCache();
    }

    /*
    |--------------------------------------------------------------------------
    | UPDATED
    |--------------------------------------------------------------------------
    */

    public function updated(
        Product $product
    ): void {

        $this->clearHomepageCache();
    }

    /*
    |--------------------------------------------------------------------------
    | DELETED
    |--------------------------------------------------------------------------
    */

    public function deleted(
        Product $product
    ): void {

        $this->clearHomepageCache();
    }

    /*
    |--------------------------------------------------------------------------
    | RESTORED
    |--------------------------------------------------------------------------
    */

    public function restored(
        Product $product
    ): void {

        $this->clearHomepageCache();
    }

    /*
    |--------------------------------------------------------------------------
    | FORCE DELETED
    |--------------------------------------------------------------------------
    */

    public function forceDeleted(
        Product $product
    ): void {

        $this->clearHomepageCache();
    }

    /*
    |--------------------------------------------------------------------------
    | CLEAR CACHE
    |--------------------------------------------------------------------------
    */

    private function clearHomepageCache(): void
    {
        Cache::forget('homepage.products');
        Cache::forget('shared.footer.products');
    }
}