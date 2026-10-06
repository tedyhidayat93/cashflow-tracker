<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Configuration;
use App\Models\ConfigurationGroup;

class ConfigurationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Configuration Group
        $this->createConfigurationGroups();

        // Configurations
        $this->createConfigurationGeneral();
        $this->createConfigurationBranding();
        $this->createConfigurationEmail();
        $this->createConfigurationPayment();
        $this->createConfigurationSecurity();
        $this->createConfigurationSubscription();
        $this->createConfigurationSystem();
        $this->createConfigurationDefaultSeo();
        $this->createConfigurationDefaultLandingPage();
    }

    private function createConfigurationGroups(): void
    {
        $groups = [
            [
                'name' => 'General',
                'code' => 'general',
            ],
            [
                'name' => 'Branding',
                'code' => 'branding',
            ],
            [
                'name' => 'Email',
                'code' => 'email',
            ],
            [
                'name' => 'Payment',
                'code' => 'payment',
            ],
            [
                'name' => 'Security',
                'code' => 'security',
            ],
            [
                'name' => 'Subscription',
                'code' => 'subscription',
            ],
            [
                'name' => 'System',
                'code' => 'system',
            ],
            [
                'name' => 'Landing Page',
                'code' => 'landing_page',
            ],
            [
                'name' => 'SEO',
                'code' => 'seo',
            ],
        ];

        foreach ($groups as $group) {
            ConfigurationGroup::updateOrCreate(
                ['code' => $group['code']],
                $group
            );
        }
    }

    private function createConfigurationGeneral(): void
    {
        $group = ConfigurationGroup::where('code', 'general')->firstOrFail();

        $configurations = [
            [
                'key' => 'app_name',
                'label' => 'Application Name',
                'value' => 'Cashflow Tracker',
                'type' => 'text',
            ],
            [
                'key' => 'app_url',
                'label' => 'Application URL',
                'value' => config('app.url'),
                'type' => 'url',
            ],
            [
                'key' => 'timezone',
                'label' => 'Timezone',
                'value' => 'Asia/Jakarta',
                'type' => 'text',
            ],
            [
                'key' => 'currency',
                'label' => 'Default Currency',
                'value' => 'IDR',
                'type' => 'text',
            ],
            [
                'key' => 'date_format',
                'label' => 'Date Format',
                'value' => 'd/m/Y',
                'type' => 'text',
            ],
        ];

        $this->insertConfigurations($group->id, $configurations);
    }

    private function createConfigurationBranding(): void
    {
        $group = ConfigurationGroup::where('code', 'branding')->firstOrFail();

        $configurations = [
            [
                'key' => 'company_name',
                'label' => 'Company Name',
                'value' => 'Cashflow Tracker',
                'type' => 'text',
            ],
            [
                'key' => 'company_email',
                'label' => 'Company Email',
                'value' => null,
                'type' => 'email',
            ],
            [
                'key' => 'company_phone',
                'label' => 'Company Phone',
                'value' => null,
                'type' => 'text',
            ],
            [
                'key' => 'company_address',
                'label' => 'Company Address',
                'value' => null,
                'type' => 'textarea',
            ],
            [
                'key' => 'logo',
                'label' => 'Logo',
                'value' => null,
                'type' => 'image',
            ],
            [
                'key' => 'favicon',
                'label' => 'Favicon',
                'value' => null,
                'type' => 'image',
            ],
        ];

        $this->insertConfigurations($group->id, $configurations);
    }

    private function createConfigurationEmail(): void
    {
        $group = ConfigurationGroup::where('code', 'email')->firstOrFail();

        $configurations = [
            [
                'key' => 'default_email_provider',
                'label' => 'Default Email Provider',
                'value' => 'smtp',
                'type' => 'select',
            ],
            [
                'key' => 'email_queue_enabled',
                'label' => 'Email Queue Enabled',
                'value' => '1',
                'type' => 'switch',
            ],
        ];

        $this->insertConfigurations($group->id, $configurations);
    }

    private function createConfigurationPayment(): void
    {
        $group = ConfigurationGroup::where('code', 'payment')->firstOrFail();

        $configurations = [
            [
                'key' => 'default_payment_provider',
                'label' => 'Default Payment Provider',
                'value' => 'midtrans',
                'type' => 'select',
            ],
            [
                'key' => 'invoice_prefix',
                'label' => 'Invoice Prefix',
                'value' => 'INV',
                'type' => 'text',
            ],
        ];

        $this->insertConfigurations($group->id, $configurations);
    }

    private function createConfigurationSecurity(): void
    {
        $group = ConfigurationGroup::where('code', 'security')->firstOrFail();

        $configurations = [
            [
                'key' => 'allow_registration',
                'label' => 'Allow Registration',
                'value' => '1',
                'type' => 'switch',
            ],
            [
                'key' => 'max_login_attempts',
                'label' => 'Max Login Attempts',
                'value' => '5',
                'type' => 'number',
            ],
            [
                'key' => 'lockout_minutes',
                'label' => 'Lockout Minutes',
                'value' => '15',
                'type' => 'number',
            ],
        ];

        $this->insertConfigurations($group->id, $configurations);
    }

    private function createConfigurationSubscription(): void
    {
        $group = ConfigurationGroup::where('code', 'subscription')->firstOrFail();

        $configurations = [
            [
                'key' => 'trial_days',
                'label' => 'Trial Days',
                'value' => '14',
                'type' => 'number',
            ],
            [
                'key' => 'grace_period_days',
                'label' => 'Grace Period Days',
                'value' => '7',
                'type' => 'number',
            ],
        ];

        $this->insertConfigurations($group->id, $configurations);
    }

    private function createConfigurationSystem(): void
    {
        $group = ConfigurationGroup::where('code', 'system')->firstOrFail();

        $configurations = [
            [
                'key' => 'maintenance_mode',
                'label' => 'Maintenance Mode',
                'value' => '0',
                'type' => 'switch',
            ],
            [
                'key' => 'allow_workspace_creation',
                'label' => 'Allow Workspace Creation',
                'value' => '1',
                'type' => 'switch',
            ],
        ];

        $this->insertConfigurations($group->id, $configurations);
    }

    private function createConfigurationDefaultSeo(): void
    {
        $group = ConfigurationGroup::where('code', 'seo')->firstOrFail();

        $configurations = [
            [
                'key' => 'default_meta_title',
                'label' => 'Default Meta Title',
                'value' => 'Cashflow Tracker',
                'type' => 'text',
            ],
            [
                'key' => 'default_meta_description',
                'label' => 'Default Meta Description',
                'value' => 'Manage your business finances smarter.',
                'type' => 'textarea',
            ],
            [
                'key' => 'default_og_image',
                'label' => 'Default OG Image',
                'value' => null,
                'type' => 'image',
            ],
        ];

        $this->insertConfigurations($group->id, $configurations);
    }

    private function createConfigurationDefaultLandingPage(): void
    {
        $group = ConfigurationGroup::where('code', 'landing_page')->firstOrFail();

        $configurations = [
            [
                'key' => 'hero_title',
                'label' => 'Hero Title',
                'value' => 'Manage Your Cashflow Better',
                'type' => 'text',
            ],
            [
                'key' => 'hero_subtitle',
                'label' => 'Hero Subtitle',
                'value' => 'Simple cashflow management for business and personal finance.',
                'type' => 'textarea',
            ],
            [
                'key' => 'hero_button_text',
                'label' => 'Hero Button Text',
                'value' => 'Start Free Trial',
                'type' => 'text',
            ],
            [
                'key' => 'hero_button_link',
                'label' => 'Hero Button Link',
                'value' => '/register',
                'type' => 'url',
            ],
        ];

        $this->insertConfigurations($group->id, $configurations);
    }

    private function insertConfigurations(
        int $groupId,
        array $configurations
    ): void {
        foreach ($configurations as $index => $configuration) {
            Configuration::updateOrCreate(
                [
                    'key' => $configuration['key'],
                ],
                [
                    'configuration_group_id' => $groupId,
                    'label' => $configuration['label'],
                    'value' => $configuration['value'] ?? null,
                    'default_value' => $configuration['value'] ?? null,
                    'type' => $configuration['type'] ?? 'text',
                    'sort_order' => $index + 1,
                ]
            );
        }
    }
}