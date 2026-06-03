<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BlogCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $blogCategories = [
            [
                'name' => 'Produk Container',
                'slug' => 'produk-container',
                'type' => 'blog',
                'description' => 'Informasi produk container dan jenisnya',
                'children' => [
                    [
                        'name' => 'Jenis Container',
                        'slug' => 'jenis-container',
                        'type' => 'blog',
                        'description' => 'Berbagai jenis container seperti dry, reefer, open top, dll',
                    ],
                    [
                        'name' => 'Container Bekas',
                        'slug' => 'container-bekas',
                        'type' => 'blog',
                        'description' => 'Container second dengan berbagai kondisi',
                    ],
                    [
                        'name' => 'Container Modifikasi',
                        'slug' => 'container-modifikasi',
                        'type' => 'blog',
                        'description' => 'Container custom untuk cafe, kantor, dll',
                    ],
                ]
            ],

            [
                'name' => 'Harga Container',
                'slug' => 'harga-container',
                'type' => 'blog',
                'description' => 'Informasi harga dan penawaran container',
                'children' => [
                    [
                        'name' => 'Update Harga',
                        'slug' => 'update-harga-container',
                        'type' => 'blog',
                        'description' => 'Harga terbaru container',
                    ],
                    [
                        'name' => 'Faktor Harga',
                        'slug' => 'faktor-harga-container',
                        'type' => 'blog',
                        'description' => 'Faktor yang mempengaruhi harga',
                    ],
                ]
            ],

            [
                'name' => 'Panduan & Edukasi',
                'slug' => 'panduan-container',
                'type' => 'blog',
                'description' => 'Tips dan panduan seputar container',
                'children' => [
                    [
                        'name' => 'Panduan Membeli',
                        'slug' => 'panduan-membeli-container',
                        'type' => 'blog',
                        'description' => 'Tips membeli container',
                    ],
                    [
                        'name' => 'Perawatan',
                        'slug' => 'perawatan-container',
                        'type' => 'blog',
                        'description' => 'Cara merawat container',
                    ],
                    [
                        'name' => 'Pengiriman',
                        'slug' => 'pengiriman-container',
                        'type' => 'blog',
                        'description' => 'Logistik dan pengiriman container',
                    ],
                ]
            ],

            [
                'name' => 'Inspirasi & Penggunaan',
                'slug' => 'inspirasi-container',
                'type' => 'blog',
                'description' => 'Ide penggunaan container',
                'children' => [
                    [
                        'name' => 'Container Cafe',
                        'slug' => 'container-cafe',
                        'type' => 'blog',
                        'description' => 'Inspirasi cafe dari container',
                    ],
                    [
                        'name' => 'Container Kantor',
                        'slug' => 'container-kantor',
                        'type' => 'blog',
                        'description' => 'Kantor berbasis container',
                    ],
                    [
                        'name' => 'Container Rumah',
                        'slug' => 'container-rumah',
                        'type' => 'blog',
                        'description' => 'Hunian berbasis container',
                    ],
                ]
            ],

            [
                'name' => 'Proyek & Studi Kasus',
                'slug' => 'proyek-container',
                'type' => 'blog',
                'description' => 'Dokumentasi dan analisis proyek',
                'children' => [
                    [
                        'name' => 'Proyek Client',
                        'slug' => 'proyek-client',
                        'type' => 'blog',
                        'description' => 'Implementasi container oleh client',
                    ],
                    [
                        'name' => 'Studi Kasus',
                        'slug' => 'studi-kasus',
                        'type' => 'blog',
                        'description' => 'Analisis penggunaan container',
                    ],
                ]
            ],

            [
                'name' => 'Berita Industri',
                'slug' => 'berita-container',
                'type' => 'blog',
                'description' => 'Update industri container dan logistik',
                'children' => [
                    [
                        'name' => 'Tren Pasar',
                        'slug' => 'tren-pasar',
                        'type' => 'blog',
                        'description' => 'Perkembangan harga dan supply',
                    ],
                    [
                        'name' => 'Regulasi',
                        'slug' => 'regulasi',
                        'type' => 'blog',
                        'description' => 'Kebijakan terkait container',
                    ],
                ]
            ],
        ];

        $this->createBlogCategories($blogCategories);
    }

    /**
     * Create blog categories recursively
     */
    private function createBlogCategories(array $categories, ?int $parentId = null): void
    {
        foreach ($categories as $categoryData) {
            $children = $categoryData['children'] ?? null;
            unset($categoryData['children']);

            $categoryData['slug'] = Str::slug($categoryData['slug']);
            $categoryData['parent_id'] = $parentId;
            $categoryData['is_active'] = true;

            $category = Category::firstOrCreate(
                ['slug' => $categoryData['slug'], 'type' => $categoryData['type']],
                $categoryData
            );

            if ($children && is_array($children)) {
                $this->createBlogCategories($children, $category->id);
            }
        }
    }
}
