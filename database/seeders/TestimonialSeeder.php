<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Testimonial;

class TestimonialSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $testimonials = [
            [
                'nama' => 'Budi Santoso',
                'keterangan' => 'Project Manager',
                'perusahaan' => 'PT. Konstruksi Maju',
                'testimoni' => 'Kontainer yang kami sewa dari ASKI sangat berkualitas dan sesuai dengan kebutuhan proyek kami. Pelayanan yang sangat memuaskan!',
                'foto_avatar' => null,
                'rate_star' => 5,
                'is_show_public' => true,
                'sequence' => 1,
            ],
            [
                'nama' => 'Siti Nurhaliza',
                'keterangan' => 'CEO',
                'perusahaan' => 'CV. Karya Mandiri',
                'testimoni' => 'Sangat puas dengan kontainer kustom yang dibuatkan. Proses pengerjaan cepat dan hasilnya sesuai ekspektasi. Recommended!',
                'foto_avatar' => null,
                'rate_star' => 5,
                'is_show_public' => true,
                'sequence' => 2,
            ],
            [
                'nama' => 'Ahmad Wijaya',
                'keterangan' => 'Operations Director',
                'perusahaan' => 'PT. Logistik Indonesia',
                'testimoni' => 'Kontainer office yang kami beli sangat fungsional dan desainnya modern. Tim ASKI sangat profesional dalam melayani.',
                'foto_avatar' => null,
                'rate_star' => 4,
                'is_show_public' => true,
                'sequence' => 3,
            ],
            [
                'nama' => 'Dewi Lestari',
                'keterangan' => 'Founder',
                'perusahaan' => 'Toko Bunga Indah',
                'testimoni' => 'Kontainer yang kami gunakan sebagai gudang sangat kokoh dan tahan lama. Harga juga sangat kompetitif.',
                'foto_avatar' => null,
                'rate_star' => 5,
                'is_show_public' => true,
                'sequence' => 4,
            ],
            [
                'nama' => 'Rudi Hermawan',
                'keterangan' => 'Store Manager',
                'perusahaan' => 'Minimarket Sejahtera',
                'testimoni' => 'Pengiriman kontainer tepat waktu dan kondisi sangat baik. Pelayanan after sales juga sangat memuaskan.',
                'foto_avatar' => null,
                'rate_star' => 4,
                'is_show_public' => true,
                'sequence' => 5,
            ],
            [
                'nama' => 'Indah Permata',
                'keterangan' => 'Event Organizer',
                'perusahaan' => 'PT. Event Creative',
                'testimoni' => 'Kontainer kustom untuk event kami sangat bagus dan multifungsi. Desainnya menarik dan sesuai dengan tema.',
                'foto_avatar' => null,
                'rate_star' => 5,
                'is_show_public' => true,
                'sequence' => 6,
            ],
        ];

        foreach ($testimonials as $testimonial) {
            Testimonial::create($testimonial);
        }
    }
}
