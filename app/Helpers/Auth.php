<?php

use App\Models\User;

if (! function_exists('current_user')) {
    function current_user(): ?User
    {
        return auth()->user();
    }
}

if (! function_exists('current_user_id')) {
    function current_user_id(): ?int
    {
        return auth()->id();
    }
}