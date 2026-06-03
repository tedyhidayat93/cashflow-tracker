<?php

namespace App\Traits;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\Format;

trait HandlesSeoImage
{
    protected function optimizeSeoImage(
        UploadedFile $file,
        string $directory = 'uploads',
        int $width = 1200,
        int $height = 630,
        int $quality = 82
    ): string {

        /*
        |--------------------------------------------------------------------------
        | Filename
        |--------------------------------------------------------------------------
        */

        $filename = uniqid('seo_') . '.webp';

        /*
        |--------------------------------------------------------------------------
        | Image Manager
        |--------------------------------------------------------------------------
        */

        $manager = ImageManager::usingDriver(
            Driver::class
        );

        /*
        |--------------------------------------------------------------------------
        | Decode Image
        |--------------------------------------------------------------------------
        */

        $image = $manager->decodePath(
            $file->getRealPath()
        );

        /*
        |--------------------------------------------------------------------------
        | Resize / Crop
        |--------------------------------------------------------------------------
        */

        // $image->cover(
        //     width: $width,
        //     height: $height
        // );
        $image->scaleDown(
            width: $width,
            height: $height
        );

        /*
        |--------------------------------------------------------------------------
        | Encode WebP
        |--------------------------------------------------------------------------
        */

        $encoded = $image->encodeUsingFormat(
            Format::WEBP,
            quality: $quality
        );

        /*
        |--------------------------------------------------------------------------
        | Save
        |--------------------------------------------------------------------------
        */

        $path = $directory . '/' . $filename;

        Storage::disk('public')->put(
            $path,
            (string) $encoded
        );

        return $path;
    }
}