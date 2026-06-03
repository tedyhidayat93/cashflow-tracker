<?php

namespace App\Services\Cashflow;

abstract class BaseService
{
    public function __construct(
        protected ActivityLogService $activityLogService
    ) {
    }
}