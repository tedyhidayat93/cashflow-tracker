<?php

namespace Database\Seeders;

use App\Models\Provider;
use App\Models\ProviderSetting;
use App\Enums\ProviderType;
use Illuminate\Database\Seeder;

class ConfigurationProvidersSeeder extends Seeder
{
    public function run(): void
    {
        $this->createProviderGroup();
        $this->createProviderWithSettings();
    }

    private function createProviderGroup() {
        $providers = [

            /*
            |--------------------------------------------------------------------------
            | Email
            |--------------------------------------------------------------------------
            */
            [
                'name' => 'SMTP',
                'code' => 'smtp',
                'type' => ProviderType::EMAIL,
                'is_active' => true,
                'is_default' => true,
            ],
            [
                'name' => 'Resend',
                'code' => 'resend',
                'type' => ProviderType::EMAIL,
            ],
            [
                'name' => 'Mailgun',
                'code' => 'mailgun',
                'type' => ProviderType::EMAIL,
            ],

            /*
            |--------------------------------------------------------------------------
            | Payment
            |--------------------------------------------------------------------------
            */
            [
                'name' => 'Midtrans',
                'code' => 'midtrans',
                'type' => ProviderType::PAYMENT,
            ],
            [
                'name' => 'Xendit',
                'code' => 'xendit',
                'type' => ProviderType::PAYMENT,
            ],
            [
                'name' => 'Stripe',
                'code' => 'stripe',
                'type' => ProviderType::PAYMENT,
            ],

            /*
            |--------------------------------------------------------------------------
            | Analytics
            |--------------------------------------------------------------------------
            */
            [
                'name' => 'Google Analytics',
                'code' => 'google_analytics',
                'type' => ProviderType::ANALYTICS,
            ],
            [
                'name' => 'Meta Pixel',
                'code' => 'meta_pixel',
                'type' => ProviderType::ANALYTICS,
            ],

            /*
            |--------------------------------------------------------------------------
            | Communication
            |--------------------------------------------------------------------------
            */
            [
                'name' => 'Telegram',
                'code' => 'telegram',
                'type' => ProviderType::COMMUNICATION,
            ],
            [
                'name' => 'WhatsApp',
                'code' => 'whatsapp',
                'type' => ProviderType::COMMUNICATION,
            ],

            /*
            |--------------------------------------------------------------------------
            | AI
            |--------------------------------------------------------------------------
            */
            [
                'name' => 'OpenAI',
                'code' => 'openai',
                'type' => ProviderType::AI,
            ],
            [
                'name' => 'Gemini',
                'code' => 'gemini',
                'type' => ProviderType::AI,
            ],
        ];

        foreach ($providers as $provider) {
            Provider::updateOrCreate(
                [
                    'code' => $provider['code'],
                ],
                [
                    'name' => $provider['name'],
                    'type' => $provider['type'],
                    'is_active' => $provider['is_active'] ?? true,
                    'is_default' => $provider['is_default'] ?? false,
                ]
            );
        }
    }

    private function createProviderWithSettings() {
        $settings = [

            'smtp' => [
                ['key' => 'smtp_host', 'label' => 'Host', 'type' => 'text'],
                ['key' => 'smtp_port', 'label' => 'Port', 'type' => 'number'],
                ['key' => 'smtp_username', 'label' => 'Username', 'type' => 'text'],
                ['key' => 'smtp_password', 'label' => 'Password', 'type' => 'password', 'is_encrypted' => true],
                ['key' => 'smtp_encryption', 'label' => 'Encryption', 'type' => 'select'],
                ['key' => 'smtp_from_name', 'label' => 'From Name', 'type' => 'text'],
                ['key' => 'smtp_from_email', 'label' => 'From Email', 'type' => 'email'],
            ],

            'resend' => [
                ['key' => 'resend_api_key', 'label' => 'API Key', 'type' => 'password', 'is_encrypted' => true],
                ['key' => 'resend_from_name', 'label' => 'From Name', 'type' => 'text'],
                ['key' => 'resend_from_email', 'label' => 'From Email', 'type' => 'email'],
            ],

            'mailgun' => [
                ['key' => 'mailgun_domain', 'label' => 'Domain', 'type' => 'text'],
                ['key' => 'mailgun_secret_key', 'label' => 'Secret Key', 'type' => 'password', 'is_encrypted' => true],
            ],

            'midtrans' => [
                ['key' => 'midtrans_server_key', 'label' => 'Server Key', 'type' => 'password', 'is_encrypted' => true],
                ['key' => 'midtrans_client_key', 'label' => 'Client Key', 'type' => 'password', 'is_encrypted' => true],
                ['key' => 'midtrans_merchant_id', 'label' => 'Merchant ID', 'type' => 'text'],
                ['key' => 'midtrans_is_production', 'label' => 'Production Mode', 'type' => 'switch'],
            ],

            'xendit' => [
                ['key' => 'xendit_secret_key', 'label' => 'Secret Key', 'type' => 'password', 'is_encrypted' => true],
                ['key' => 'xendit_webhook_token', 'label' => 'Webhook Token', 'type' => 'password', 'is_encrypted' => true],
            ],

            'stripe' => [
                ['key' => 'stripe_publishable_key', 'label' => 'Publishable Key', 'type' => 'text'],
                ['key' => 'stripe_secret_key', 'label' => 'Secret Key', 'type' => 'password', 'is_encrypted' => true],
                ['key' => 'stripe_webhook_secret', 'label' => 'Webhook Secret', 'type' => 'password', 'is_encrypted' => true],
            ],

            'google_analytics' => [
                ['key' => 'ga_measurement_id', 'label' => 'Measurement ID', 'type' => 'text'],
            ],

            'meta_pixel' => [
                ['key' => 'meta_pixel_id', 'label' => 'Pixel ID', 'type' => 'text'],
            ],

            'telegram' => [
                ['key' => 'telegram_bot_token', 'label' => 'Bot Token', 'type' => 'password', 'is_encrypted' => true],
                ['key' => 'telegram_chat_id', 'label' => 'Chat ID', 'type' => 'text'],
            ],

            'whatsapp' => [
                ['key' => 'whatsapp_api_url', 'label' => 'API URL', 'type' => 'url'],
                ['key' => 'whatsapp_token', 'label' => 'Token', 'type' => 'password', 'is_encrypted' => true],
                ['key' => 'whatsapp_sender_number', 'label' => 'Sender Number', 'type' => 'text'],
            ],

            'openai' => [
                ['key' => 'openai_api_key', 'label' => 'API Key', 'type' => 'password', 'is_encrypted' => true],
                ['key' => 'openai_organization', 'label' => 'Organization', 'type' => 'text'],
                ['key' => 'openai_project_id', 'label' => 'Project ID', 'type' => 'text'],
            ],

            'gemini' => [
                ['key' => 'gemini_api_key', 'label' => 'API Key', 'type' => 'password', 'is_encrypted' => true],
            ],
        ];

        foreach ($settings as $providerCode => $fields) {
            $provider = Provider::where('code', $providerCode)->first();

            if (! $provider) {
                continue;
            }

            foreach ($fields as $index => $field) {
                ProviderSetting::updateOrCreate(
                    [
                        'provider_id' => $provider->id,
                        'key' => $field['key'],
                    ],
                    [
                        'label' => $field['label'],
                        'type' => $field['type'],
                        'sort_order' => $index + 1,
                        'is_required' => true,
                        'is_encrypted' => $field['is_encrypted'] ?? false,
                    ]
                );
            }
        }
    }
}