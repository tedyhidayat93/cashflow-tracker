<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Http;

class Recaptcha
{
    public static function verify(
        ?string $token,
        string $action = '',
        float $minScore = 0.5
    ): bool {
        if (!$token) {
            return false;
        }

        try {
            $response = Http::asForm()->post(
                'https://www.google.com/recaptcha/api/siteverify',
                [
                    'secret' => config('services.recaptcha.secret'),
                    'response' => $token,
                ]
            );

            if (!$response->successful()) {
                return false;
            }

            $data = $response->json();

            return
                ($data['success'] ?? false) === true &&
                ($data['action'] ?? '') === $action &&
                ($data['score'] ?? 0) >= $minScore;

        } catch (\Throwable $e) {
            report($e);

            return false;
        }
    }
}