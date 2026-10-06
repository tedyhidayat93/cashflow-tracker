<?php

namespace App\Traits\Models;

trait HasWorkspaceOwnership
{
    protected static function bootHasWorkspaceOwnership(): void
    {
        static::creating(function ($model) {

            if (
                empty($model->workspace_id)
            ) {
                $model->workspace_id =
                    current_workspace_id();
            }

            if (
                empty($model->created_by)
            ) {
                $model->created_by =
                    current_user_id();
            }

            if (
                empty($model->updated_by)
            ) {
                $model->updated_by =
                    current_user_id();
            }
        });

        static::updating(function ($model) {

            $model->updated_by =
                current_user_id();
        });
    }
}