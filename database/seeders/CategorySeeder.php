<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
        [
            'name' => 'Container',
            'slug' => 'container',
            'type' => 'product',
            'description' => 'Berbagai jenis container untuk kebutuhan logistik dan industri',
            'children' => [
                // General
                [
                    'name' => 'Dry Container (Standar)',
                    'slug' => 'dry-container',
                    'type' => 'product',
                    'description' => 'Container standar untuk pengiriman barang umum',
                ],
                // Temperature
                [
                    'name' => 'Reefer Container (Pendingin)',
                    'slug' => 'reefer-container',
                    'type' => 'product',
                    'description' => 'Container dengan sistem pendingin untuk barang sensitif suhu',
                ],
                // Liquid
                [
                    'name' => 'Tank Container',
                    'slug' => 'tank-container',
                    'type' => 'product',
                    'description' => 'Container untuk cairan, gas, atau bahan kimia',
                ],
                // Open Type
                [
                    'name' => 'Open Top Container',
                    'slug' => 'open-top-container',
                    'type' => 'product',
                    'description' => 'Container terbuka di bagian atas untuk barang tinggi',
                ],
                [
                    'name' => 'Open Side Container',
                    'slug' => 'open-side-container',
                    'type' => 'product',
                    'description' => 'Container dengan pintu samping yang bisa dibuka penuh',
                ],
                // Heavy Cargo
                [
                    'name' => 'Flat Rack Container',
                    'slug' => 'flat-rack-container',
                    'type' => 'product',
                    'description' => 'Container tanpa dinding samping untuk alat berat atau barang besar',
                ],
                [
                    'name' => 'Platform Container',
                    'slug' => 'platform-container',
                    'type' => 'product',
                    'description' => 'Container tanpa dinding untuk barang super besar',
                ],
                // Offshore / Special
                [
                    'name' => 'Offshore Container (DNV)',
                    'slug' => 'offshore-container',
                    'type' => 'product',
                    'description' => 'Container bersertifikasi DNV untuk kebutuhan offshore dan industri berat',
                ],
                // Custom
                [
                    'name' => 'Custom Container',
                    'slug' => 'custom-container',
                    'type' => 'product',
                    'description' => 'Container modifikasi sesuai kebutuhan (office, cafe, dll)',
                ],
            ]
        ],

        [
            'name' => 'Heavy Equipment',
            'slug' => 'heavy-equipment',
            'type' => 'product',
            'description' => 'Berbagai jenis peralatan berat untuk kebutuhan industri',
            'children' => [
                [
                    'name' => 'Excavator',
                    'slug' => 'excavator',
                    'type' => 'product',
                    'description' => 'Excavator untuk pekerjaan tanah dan konstruksi',
                ],
                [
                    'name' => 'Forklift',
                    'slug' => 'forklift',
                    'type' => 'product',
                    'description' => 'Kendaraan industri yang dilengkapi garpu besi (fork) di bagian depan untuk mengangkat, memindahkan, dan menyusun material berat dalam jarak pendek.',
                ],
                [
                    'name' => 'Reach Stacker',
                    'slug' => 'reach-stacker',
                    'type' => 'product',
                    'description' => "Reach Stacker container crane digunakan untuk penanganan peti kemas",
                ],
            ]
        ],

        [
            'name' => 'Property',
            'slug' => 'property',
            'type' => 'product',
            'description' => 'Modifikasi container menjadi bangunan fungsional',
            'children' => [

                [
                    'name' => 'Rumah',
                    'slug' => 'rumah',
                    'type' => 'product',
                    'description' => 'Hunian berbasis container',
                ],
                [
                    'name' => 'Gudang',
                    'slug' => 'gudang',
                    'type' => 'product',
                    'description' => 'Penyimpanan barang berbasis container',
                ],
                [
                    'name' => 'Kantor',
                    'slug' => 'kantor',
                    'type' => 'product',
                    'description' => 'Office container untuk proyek atau bisnis',
                ],
                [
                    'name' => 'Depo',
                    'slug' => 'depo',
                    'type' => 'product',
                    'description' => 'Tempat penyimpanan container atau logistik',
                ],

            ]
        ],

        [
            'name' => 'Service',
            'slug' => 'service',
            'type' => 'service',
            'description' => 'Berbagai layanan profesional untuk kebutuhan kontainer dan logistik',
            'children' => [

                [
                    'name' => 'Domestic Shipping',
                    'slug' => 'domestic-shipping',
                    'type' => 'service',
                    'description' => 'Pengiriman domestik meliputi trucking, pickup & delivery, cargo oversize, serta jalur udara dan laut',
                ],

                [
                    'name' => 'Jual & Beli Kontainer',
                    'slug' => 'jual-beli-container',
                    'type' => 'service',
                    'description' => 'Menjual berbagai jenis kontainer baru dan bekas dengan harga kompetitif',
                ],

                [
                    'name' => 'Maintenance & Repairing',
                    'slug' => 'maintenance-repairing',
                    'type' => 'service',
                    'description' => 'Perawatan dan perbaikan kontainer oleh tim bersertifikasi IICL dengan garansi',
                ],

                [
                    'name' => 'Modifikasi Kontainer',
                    'slug' => 'modifikasi-container',
                    'type' => 'service',
                    'description' => 'Layanan modifikasi kontainer untuk berbagai kebutuhan seperti rumah, kantor, dan bisnis',
                ],

                [
                    'name' => 'Sewa Alat Berat',
                    'slug' => 'sewa-alat-berat',
                    'type' => 'service',
                    'description' => 'Penyewaan alat berat seperti Reach Stacker dan Forklift dengan layanan 24 jam',
                ],

                [
                    'name' => 'Sewa Depo',
                    'slug' => 'sewa-depo',
                    'type' => 'service',
                    'description' => 'Pengelolaan container yard dan depot penitipan kontainer di lokasi strategis',
                ],

                [
                    'name' => 'Sewa Gudang',
                    'slug' => 'sewa-gudang',
                    'type' => 'service',
                    'description' => 'Gudang terbuka dan tertutup untuk kegiatan stuffing dan stripping',
                ],

                [
                    'name' => 'Sewa Kontainer',
                    'slug' => 'sewa-container',
                    'type' => 'service',
                    'description' => 'Penyewaan berbagai tipe kontainer dengan harga kompetitif',
                ],

            ]
        ]
    ];

        $this->createCategories($categories);
    }

    /**
     * Create categories recursively
     */
    private function createCategories(array $categories, ?int $parentId = null): void
    {
        foreach ($categories as $categoryData) {
            $children = $categoryData['children'] ?? null;
            unset($categoryData['children']);

            $categoryData['slug'] = Str::slug($categoryData['slug']);
            $categoryData['parent_id'] = $parentId;
            $categoryData['is_active'] = true;

            $category = Category::firstOrCreate(
                ['slug' => $categoryData['slug']],
                $categoryData
            );

            if ($children && is_array($children)) {
                $this->createCategories($children, $category->id);
            }
        }
    }
}
