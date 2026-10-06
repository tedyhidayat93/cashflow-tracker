<?php

if (!function_exists('normalize_currency')) {
    function normalize_currency($value)
    {
        if ($value === null || $value === '') {
            return null;
        }

        // remove thousand separator (.)
        $value = str_replace('.', '', $value);

        // convert decimal comma to dot
        $value = str_replace(',', '.', $value);

        return is_numeric($value) ? $value : null;
    }
}