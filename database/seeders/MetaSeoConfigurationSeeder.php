<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Configuration;

class MetaSeoConfigurationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        
        // Other Configuration
        $this->createSEOConfiguration();
    }

    /**
     * Create site configuration settings
     */
    private function createSEOConfiguration(): void
    {
        $siteConfigs = [
            // Home Page
            [
                'label' => 'Beranda Image',
                'description' => 'Upload meta image untuk SEO',
                'group' => 'seo',
                'key' => 'homepage_meta_image',
                'value' => '/images/placeholder.png',
                'type' => 'image',
            ],
            [
                'label' => 'Beranda Meta Title',
                'description' => 'SEO Meta title untuk beranda',
                'group' => 'seo',
                'key' => 'homepage_meta_title',
                'value' => 'Beranda Meta Title',
                'type' => 'text',
            ],
            [
                'label' => 'Beranda Meta Description',
                'description' => 'SEO Meta description untuk beranda',
                'group' => 'seo',
                'key' => 'homepage_meta_description',
                'value' => 'Beranda Meta Description',
                'type' => 'textarea',
            ],
            
            // Services Page
            [
                'label' => 'Layanan Meta Image',
                'description' => 'Upload meta image untuk SEO',
                'group' => 'seo',
                'key' => 'services_meta_image',
                'value' => '/images/placeholder.png',
                'type' => 'image',
            ],
            [
                'label' => 'Layanan Meta Title',
                'description' => 'SEO Meta title untuk layanan',
                'group' => 'seo',
                'key' => 'services_meta_title',
                'value' => 'Layanan Meta Title',
                'type' => 'text',
            ],
            [
                'label' => 'Layanan Meta Description',
                'description' => 'SEO Meta description untuk layanan',
                'group' => 'seo',
                'key' => 'services_meta_description',
                'value' => 'Layanan Meta Description',
                'type' => 'textarea',
            ],

            // Catalog Page
            [
                'label' => 'Katalog Meta Image',
                'description' => 'Upload meta image untuk SEO',
                'group' => 'seo',
                'key' => 'catalog_meta_image',
                'value' => '/images/placeholder.png',
                'type' => 'image',
            ],
            [
                'label' => 'Katalog Meta Title',
                'description' => 'SEO Meta title untuk katalog page',
                'group' => 'seo',
                'key' => 'catalog_meta_title',
                'value' => 'Katalog Meta Title',
                'type' => 'text',
            ],
            [
                'label' => 'Katalog Meta Description',
                'description' => 'SEO Meta description untuk katalog page',
                'group' => 'seo',
                'key' => 'catalog_meta_description',
                'value' => 'Katalog Meta Description',
                'type' => 'textarea',
            ],

            // Aricle Page
            [
                'label' => 'Artikel Meta Image',
                'description' => 'Upload meta image untuk SEO',
                'group' => 'seo',
                'key' => 'article_meta_image',
                'value' => '/images/placeholder.png',
                'type' => 'image',
            ],
            [
                'label' => 'Artikel Meta Title',
                'description' => 'SEO Meta title untuk artikel page',
                'group' => 'seo',
                'key' => 'article_meta_title',
                'value' => 'Article Meta Title',
                'type' => 'text',
            ],
            [
                'label' => 'Artikel Meta Description',
                'description' => 'SEO Meta description untuk artikel page',
                'group' => 'seo',
                'key' => 'article_meta_description',
                'value' => 'Article Meta Description',
                'type' => 'textarea',
            ],
            
            
        ];

        foreach ($siteConfigs as $config) {
            Configuration::firstOrCreate(
                ['key' => $config['key'], 'group' => $config['group']],
                $config
            );
        }
    }
}
