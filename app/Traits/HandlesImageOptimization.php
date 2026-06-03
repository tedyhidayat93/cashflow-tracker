<?php

namespace App\Traits;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Laravel\Facades\Image;

trait HandlesImageOptimization
{
    protected function optimizeImage(
        UploadedFile $file,
        string $directory = 'uploads',
        int $maxWidth = 1920,
        int $quality = 80
    ): string {

        $filename =
            uniqid('img_')
            . '.webp';

        $image = Image::read(
            $file->getRealPath()
        );

        if ($image->width() > $maxWidth) {

            $image->scale(
                width: $maxWidth
            );
        }

        $encoded = $image->toWebp(
            $quality
        );

        $path = $directory . '/' . $filename;

        Storage::disk('public')->put(
            $path,
            (string) $encoded
        );

        return $path;
    }
}