<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Faq;

class FaqSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faqs = [
            [
                'question' => 'Apa itu kontainer?',
                'answer' => 'Kontainer adalah peti kemas berbahan baja yang digunakan untuk pengiriman barang melalui kapal, kereta, atau truk. Kontainer juga sering dimanfaatkan untuk gudang, kantor, kafe, rumah modular, dan proyek konstruksi.',
                'category' => 'General',
                'position' => 1,
                'is_active' => true,
            ],
            [
                'question' => 'Jenis kontainer apa saja yang tersedia?',
                'answer' => 'Beberapa jenis kontainer yang umum dijual antara lain: Dry Container 20 Feet, Dry Container 40 Feet, 40 Feet High Cube, Reefer Container (Kontainer Pendingin), Open Top Container, Flat Rack Container.',
                'category' => 'General',
                'position' => 2,
                'is_active' => true,
            ],
            [
                'question' => 'Berapa ukuran kontainer yang paling umum?',
                'answer' => 'Ukuran yang paling sering digunakan adalah: 20 Feet Container (Panjang ±6 meter), 40 Feet Container (Panjang ±12 meter), 40 Feet High Cube (Sama seperti 40 feet tetapi lebih tinggi ±30 cm).',
                'category' => 'General',
                'position' => 3,
                'is_active' => true,
            ],
            [
                'question' => 'Apakah kontainer yang dijual baru atau bekas?',
                'answer' => 'Kami menyediakan: Kontainer baru (New Container / One Trip), Kontainer bekas layak pakai (Cargo Worthy / CW), Kontainer bekas untuk gudang atau modifikasi.',
                'category' => 'General',
                'position' => 4,
                'is_active' => true,
            ],
            [
                'question' => 'Apa itu kontainer One Trip?',
                'answer' => 'Kontainer One Trip adalah kontainer yang baru diproduksi dan hanya digunakan sekali untuk pengiriman dari pabrik ke negara tujuan.',
                'category' => 'General',
                'position' => 5,
                'is_active' => true,
            ],
            [
                'question' => 'Apa perbedaan kontainer Cargo Worthy dan bekas biasa?',
                'answer' => 'Cargo Worthy (CW) - Masih layak digunakan untuk pengiriman internasional. Bekas Gudang - Tidak direkomendasikan untuk pengiriman, tetapi cocok untuk penyimpanan atau modifikasi.',
                'category' => 'General',
                'position' => 6,
                'is_active' => true,
            ],
            [
                'question' => 'Apakah kontainer dijamin tidak bocor?',
                'answer' => 'Ya, kontainer yang dijual biasanya telah melalui pemeriksaan struktur, pintu, dan atap untuk memastikan tidak bocor dan aman digunakan.',
                'category' => 'Quality',
                'position' => 7,
                'is_active' => true,
            ],
            [
                'question' => 'Apakah bisa memilih warna kontainer?',
                'answer' => 'Umumnya warna kontainer mengikuti stok yang tersedia seperti: Biru, Merah, Hijau, Abu-abu. Namun beberapa supplier menyediakan repaint (cat ulang) sesuai kebutuhan.',
                'category' => 'Quality',
                'position' => 8,
                'is_active' => true,
            ],
            [
                'question' => 'Apakah tersedia layanan pengiriman?',
                'answer' => 'Ya, kami menyediakan layanan pengiriman kontainer ke seluruh wilayah Indonesia menggunakan truk trailer atau crane truck.',
                'category' => 'Service',
                'position' => 9,
                'is_active' => true,
            ],
            [
                'question' => 'Berapa lama proses pengiriman?',
                'answer' => 'Waktu pengiriman tergantung lokasi tujuan: Dalam kota: 1–3 hari, Luar kota / antar pulau: 3–14 hari.',
                'category' => 'Service',
                'position' => 10,
                'is_active' => true,
            ],
            [
                'question' => 'Apakah kontainer bisa dimodifikasi?',
                'answer' => 'Bisa. Kontainer dapat dimodifikasi menjadi: Kantor proyek, Kafe atau booth, Gudang, Rumah kontainer, Toilet portable, Pos security.',
                'category' => 'Service',
                'position' => 11,
                'is_active' => true,
            ],
            [
                'question' => 'Apakah ada garansi?',
                'answer' => 'Biasanya tersedia garansi kebocoran dan struktur selama periode tertentu tergantung kebijakan penjual.',
                'category' => 'Service',
                'position' => 12,
                'is_active' => true,
            ],
            [
                'question' => 'Bagaimana cara pemesanan kontainer?',
                'answer' => 'Langkah pemesanan: Pilih jenis dan ukuran kontainer, Konfirmasi harga dan lokasi pengiriman, Pembayaran DP / pelunasan, Kontainer dikirim ke lokasi.',
                'category' => 'Order',
                'position' => 13,
                'is_active' => true,
            ],
            [
                'question' => 'Metode pembayaran apa saja yang tersedia?',
                'answer' => 'Umumnya pembayaran dapat dilakukan melalui: Transfer bank, Cash, Termin pembayaran (untuk proyek tertentu).',
                'category' => 'Order',
                'position' => 14,
                'is_active' => true,
            ],
            [
                'question' => 'Apakah bisa survei kontainer terlebih dahulu?',
                'answer' => 'Ya, pembeli biasanya diperbolehkan melakukan pengecekan langsung di depo atau gudang kontainer sebelum membeli.',
                'category' => 'Order',
                'position' => 15,
                'is_active' => true,
            ],
        ];

        foreach ($faqs as $faqData) {
            Faq::create($faqData);
        }
    }
}
