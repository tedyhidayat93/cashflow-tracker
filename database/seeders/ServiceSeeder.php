<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Service;
use Illuminate\Support\Str;

class ServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $services = [
            [
                'name' => 'Jual & Beli Kontainer',
                'slug' => 'jual-beli-kontainer',
                'description' => 'Menjual berbagai jenis kontainer baru dan bekas seperti Dry Container, Open Top, Flatrack, Refrigerated, dan ISO Tank dengan ukuran 10 Ft, 20 Ft, 40 Ft, dan 40 Ft HC dengan harga kompetitif.',
                'short_description' => 'Jual beli kontainer baru dan bekas dengan harga kompetitif',
                'status' => 'active',
                'is_featured' => true,
                'meta_title' => 'Jual & Beli Kontainer Murah | Harga Kompetitif',
                'meta_description' => 'Jual beli kontainer baru dan bekas: Dry Container, Open Top, Flatrack, Refrigerated, ISO Tank ukuran 10-40 Ft dengan harga terbaik.'
            ],
            [
                'name' => 'Sewa Kontainer',
                'slug' => 'sewa-kontainer',
                'description' => 'Layanan sewa kontainer berbagai tipe dan ukuran seperti Dry Container, Open Top, Flatrack, Refrigerated, dan ISO Tank dengan harga yang bersaing.',
                'short_description' => 'Sewa kontainer berbagai tipe dan ukuran dengan harga bersaing',
                'status' => 'active',
                'is_featured' => true,
                'meta_title' => 'Sewa Kontainer | Harga Bersaing | Berbagai Tipe',
                'meta_description' => 'Sewa kontainer murah: Dry Container, Open Top, Flatrack, Refrigerated, ISO Tank dengan harga bersaing untuk kebutuhan bisnis Anda.'
            ],
            [
                'name' => 'Modifikasi Kontainer',
                'slug' => 'modifikasi-kontainer',
                'description' => 'Melayani modifikasi kontainer untuk perumahan, kantor, klinik, rumah sakit, café, dan kebutuhan lainnya dengan ukuran 10 Ft, 20 Ft, 40 Ft, dan 40 Ft HC sesuai budget.',
                'short_description' => 'Modifikasi kontainer untuk rumah, kantor, café sesuai budget',
                'status' => 'active',
                'is_featured' => false,
                'meta_title' => 'Modifikasi Kontainer | Rumah, Kantor, Café Custom',
                'meta_description' => 'Jasa modifikasi kontainer untuk rumah, kantor, klinik, café. Ukuran 10-40 Ft, desain custom sesuai budget.'
            ],
            [
                'name' => 'Sewa Gudang Terbuka & Tertutup',
                'slug' => 'sewa-gudang-terbuka-tertutup',
                'description' => 'Menyediakan gudang terbuka dan tertutup untuk kegiatan stuffing dan stripping impor maupun ekspor dengan dukungan peralatan mekanik lengkap.',
                'short_description' => 'Sewa gudang untuk stuffing stripping impor ekspor',
                'status' => 'active',
                'is_featured' => false,
                'meta_title' => 'Sewa Gudang Terbuka & Tertutup | Stuffing Stripping',
                'meta_description' => 'Sewa gudang terbuka dan tertutup untuk stuffing stripping impor ekspor dengan peralatan mekanik lengkap.'
            ],
            [
                'name' => 'Sewa Depo',
                'slug' => 'sewa-depo',
                'description' => 'Layanan pengelolaan container yard atau depot penitipan kontainer ex impor yang berlokasi strategis dekat Pelabuhan Tanjung Priok.',
                'short_description' => 'Depo penitipan kontainer ex impor strategis dekat Tanjung Priok',
                'status' => 'active',
                'is_featured' => false,
                'meta_title' => 'Sewa Depo Kontainer | Container Yard Tanjung Priok',
                'meta_description' => 'Layanan sewa depo kontainer ex impor strategis dekat Pelabuhan Tanjung Priok dengan pengelolaan profesional.'
            ],
            [
                'name' => 'Sewa Alat Berat',
                'slug' => 'sewa-alat-berat',
                'description' => 'Melayani sewa alat berat seperti Reach Stacker dan Forklift di seluruh Indonesia dengan layanan operasional 24 jam.',
                'short_description' => 'Sewa alat berat Reach Stacker Forklift 24 jam',
                'status' => 'active',
                'is_featured' => false,
                'meta_title' => 'Sewa Alat Berat | Reach Stacker & Forklift 24 Jam',
                'meta_description' => 'Sewa alat berat Reach Stacker dan Forklift di seluruh Indonesia dengan layanan operasional 24 jam nonstop.'
            ],
            [
                'name' => 'Maintenance & Repairing Container',
                'slug' => 'maintenance-repairing-container',
                'description' => 'Didukung tim berkualifikasi IICL untuk perawatan dan perbaikan kontainer di lokasi pelanggan dengan standar terbaik dan garansi satu tahun.',
                'short_description' => 'Maintenance repair kontainer dengan tim IICL certified',
                'status' => 'active',
                'is_featured' => false,
                'meta_title' => 'Maintenance & Repair Container | Sertifikat IICL',
                'meta_description' => 'Jasa maintenance dan repair kontainer dengan tim IICL certified, garansi 1 tahun, layanan di lokasi pelanggan.'
            ],
            [
                'name' => 'Domestic Shipping',
                'slug' => 'domestic-shipping',
                'description' => 'Layanan pengiriman domestik meliputi trucking darat, pickup & delivery lokal, cargo oversize, serta pengiriman melalui jalur udara dan laut.',
                'short_description' => 'Pengiriman domestik trucking udara laut cargo',
                'status' => 'active',
                'is_featured' => true,
                'meta_title' => 'Domestic Shipping | Trucking Udara Laut Cargo',
                'meta_description' => 'Layanan pengiriman domestik: trucking darat, pickup delivery lokal, cargo oversize, pengiriman udara dan laut.'
            ]
        ];

        foreach ($services as $serviceData) {
            Service::create($serviceData);
        }
    }
}
