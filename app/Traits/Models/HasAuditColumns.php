<?php

namespace App\Traits\Models;

trait HasAuditColumns
{
    use HasCreatedBy;
    use HasUpdatedBy;
    use HasDeletedBy;
}