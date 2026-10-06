<?php

namespace App\Models\Cashflow;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Models\HasAuditColumns;
use App\Traits\Models\BelongsToWorkspace;
use App\Traits\Models\HasWorkspaceOwnership;

abstract class BaseModel extends Model
{
    use BelongsToWorkspace;
    use HasAuditColumns;
    use HasWorkspaceOwnership;
}