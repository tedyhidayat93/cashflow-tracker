<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Configuration;
use Illuminate\Http\Request;

class ConfigurationController extends Controller
{
    /**
     * Get configurations by group or all configurations
     */
    public function index(Request $request, $group = null)
    {
        if ($group) {
            $configurations = Configuration::where('group', $group)
                ->orderBy('label')
                ->get(['key', 'value', 'type', 'label', 'description', 'group']);
        } else {
            $configurations = Configuration::orderBy('group')
                ->orderBy('label')
                ->get(['key', 'value', 'type', 'label', 'description', 'group']);
        }

        // Transform to key-value pairs for easier frontend usage
        $configMap = [];
        foreach ($configurations as $config) {
            $configMap[$config->key] = [
                'value' => $config->value,
                'type' => $config->type,
                'label' => $config->label,
                'description' => $config->description,
                'group' => $config->group,
            ];
        }

        // Group configurations by group
        $groupedConfigurations = [];
        foreach ($configurations as $config) {
            if (!isset($groupedConfigurations[$config->group])) {
                $groupedConfigurations[$config->group] = [];
            }
            $groupedConfigurations[$config->group][$config->key] = [
                'value' => $config->value,
                'type' => $config->type,
                'label' => $config->label,
                'description' => $config->description,
            ];
        }

        return response()->json([
            'configurations' => $configMap,
            'grouped' => $groupedConfigurations,
            'group' => $group,
        ]);
    }
}
