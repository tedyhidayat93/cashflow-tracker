<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Configuration;

class ConfigurationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Site Configuration
        $this->createSiteConfiguration();
        
        // Email/SMTP Configuration
        $this->createEmailConfiguration();
        
        // Homepage Configuration
        $this->createHomepageConfiguration();
        
        // Other Configuration
        $this->createOtherConfiguration();
    }

    /**
     * Create site configuration settings
     */
    private function createSiteConfiguration(): void
    {
        $siteConfigs = [
            // Basic Site Info
            [
                'label' => 'Nama Situs',
                'description' => 'Nama utama website atau perusahaan',
                'group' => 'site',
                'key' => 'site_name',
                'value' => 'Alumoda Sinergi Kontainer Indonesia',
                'type' => 'text',
            ],
            [
                'label' => 'Tagline',
                'description' => 'Tagline atau slogan website',
                'group' => 'site',
                'key' => 'site_tagline',
                'value' => 'Solusi Terpercaya Untuk Kebutuhan Kontainer Anda',
                'type' => 'text',
            ],
            [
                'label' => 'Logo Website',
                'description' => 'Upload logo utama website',
                'group' => 'site',
                'key' => 'site_logo',
                'value' => '/images/logo-main.png',
                'type' => 'image',
            ],
            [
                'label' => 'Favicon',
                'description' => 'Upload favicon website',
                'group' => 'site',
                'key' => 'site_favicon',
                'value' => '/images/logo-main-square.png',
                'type' => 'image',
            ],
            
            // SEO Meta Configuration
            [
                'label' => 'Meta Keywords SEO',
                'description' => 'Kata kunci SEO untuk optimasi mesin pencari',
                'group' => 'site',
                'key' => 'meta_keywords',
                'value' => 'jual kontainer, beli kontainer, kontainer bekas, kontainer baru, modifikasi kontainer, sewa kontainer, container office, container gudang, PT Alumoda Sinergi Kontainer Indonesia, kontainer murah, kontainer jakarta, kontainer berkualitas, solusi kontainer',
                'type' => 'textarea',
            ],
            [
                'label' => 'Meta Description SEO',
                'description' => 'Deskripsi meta untuk optimasi mesin pencari',
                'group' => 'site',
                'key' => 'meta_description',
                'value' => 'PT Alumoda Sinergi Kontainer Indonesia - Solusi terpercaya untuk jual beli, modifikasi, dan sewa kontainer berkualitas di Jakarta.',
                'type' => 'textarea',
            ],
            
            // Address Configuration
            [
                'label' => 'Alamat Lengkap',
                'description' => 'Alamat lengkap kantor atau bisnis',
                'group' => 'site',
                'key' => 'address',
                'value' => 'Jl. Cakung Cilincing Raya No.89, Semper Tim., Kec. Cilincing, Jkt Utara, Daerah Khusus Ibukota Jakarta 14120',
                'type' => 'textarea',
            ],
            [
                'label' => 'Embed Google Maps',
                'description' => 'Embed code atau URL Google Maps lokasi',
                'group' => 'site',
                'key' => 'google_maps_embed',
                'value' => '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d113885.92660411324!2d106.79108264335937!3d-6.130849200000007!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6a214787b28f19%3A0x1b0ec0f2ce41af00!2sPT.%20Alumoda%20Sinergi%20Kontainer%20Indonesia!5e1!3m2!1sid!2sid!4v1773399581691!5m2!1sid!2sid" width="400" height="300" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
                'type' => 'textarea',
            ],
            
            // Contact Configuration
            [
                'label' => 'Email Kontak',
                'description' => 'Email utama untuk kontak bisnis',
                'group' => 'site',
                'key' => 'contact_email',
                'value' => 'info@alumodasinergi.com',
                'type' => 'text',
            ],
            [
                'label' => 'Nomor WhatsApp',
                'description' => 'Nomor WhatsApp untuk kontak',
                'group' => 'site',
                'key' => 'contact_whatsapp',
                'value' => '6281282336464',
                'type' => 'text',
            ],
            [
                'label' => 'Nomor Telepon',
                'description' => 'Nomor telepon kantor',
                'group' => 'site',
                'key' => 'contact_phone',
                'value' => '6281282336464',
                'type' => 'text',
            ],
            
            // Social Media Configuration
            [
                'label' => 'Facebook',
                'description' => 'Link profil Facebook',
                'group' => 'site',
                'key' => 'social_facebook',
                'value' => 'https://facebook.com/companyprofileaski',
                'type' => 'text',
            ],
            [
                'label' => 'Twitter/X',
                'description' => 'Link profil Twitter/X',
                'group' => 'site',
                'key' => 'social_twitter',
                'value' => 'https://twitter.com/companyprofileaski',
                'type' => 'text',
            ],
            [
                'label' => 'Instagram',
                'description' => 'Link profil Instagram',
                'group' => 'site',
                'key' => 'social_instagram',
                'value' => 'https://instagram.com/companyprofileaski',
                'type' => 'text',
            ],
            [
                'label' => 'YouTube',
                'description' => 'Link channel YouTube',
                'group' => 'site',
                'key' => 'social_youtube',
                'value' => 'https://youtube.com/@companyprofileaski',
                'type' => 'text',
            ],
            [
                'label' => 'TikTok',
                'description' => 'Link profil TikTok',
                'group' => 'site',
                'key' => 'social_tiktok',
                'value' => 'https://tiktok.com/@companyprofileaski',
                'type' => 'text',
            ],
            
            // WhatsApp Message Configuration
            [
                'label' => 'Pesan WhatsApp Default',
                'description' => 'Template pesan default untuk WhatsApp direct message',
                'group' => 'site',
                'key' => 'whatsapp_message',
                'value' => 'Halo, saya tertarik dengan layanan Anda. Mohon Berikan price list terbaik dari ASKI.',
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

    /**
     * Create email/SMTP configuration settings
     */
    private function createEmailConfiguration(): void
    {
        $emailConfigs = [
            [
                'label' => 'SMTP Host',
                'description' => 'Server host untuk SMTP',
                'group' => 'email',
                'key' => 'smtp_host',
                'value' => 'sandbox.smtp.mailtrap.io',
                'type' => 'text',
            ],
            [
                'label' => 'SMTP Port',
                'description' => 'Port untuk koneksi SMTP',
                'group' => 'email',
                'key' => 'smtp_port',
                'value' => '587',
                'type' => 'number',
            ],
            [
                'label' => 'SMTP Username',
                'description' => 'Username untuk autentikasi SMTP',
                'group' => 'email',
                'key' => 'smtp_username',
                'value' => '5047d4d9b73dfc',
                'type' => 'text',
            ],
            [
                'label' => 'SMTP Password',
                'description' => 'Password untuk autentikasi SMTP',
                'group' => 'email',
                'key' => 'smtp_password',
                'value' => '9381037ea04fe8',
                'type' => 'text',
            ],
            [
                'label' => 'SMTP Encryption',
                'description' => 'Jenis enkripsi SMTP',
                'group' => 'email',
                'key' => 'smtp_encryption',
                'value' => 'SSL',
                'type' => 'text',
            ],
            [
                'label' => 'Email From Address',
                'description' => 'Email pengirim default',
                'group' => 'email',
                'key' => 'mail_from_address',
                'value' => 'noreply@yourdomain.com',
                'type' => 'text',
            ],
            [
                'label' => 'Email From Name',
                'description' => 'Nama pengirim default',
                'group' => 'email',
                'key' => 'mail_from_name',
                'value' => 'Your Company',
                'type' => 'text',
            ],
        ];

        foreach ($emailConfigs as $config) {
            Configuration::firstOrCreate(
                ['key' => $config['key'], 'group' => $config['group']],
                $config
            );
        }
    }

    /**
     * Create homepage content configuration settings
     */
    private function createHomepageConfiguration(): void
    {
        $homepageConfigs = [
            // Hero Section
            [
                'label' => 'Hero Image',
                'description' => 'Upload gambar hero section',
                'group' => 'view_homepage',
                'key' => 'hero_image',
                'value' => '/images/bg-hero.png',
                'type' => 'image',
            ],
            [
                'label' => 'Hero Title',
                'description' => 'Judul utama halaman depan',
                'group' => 'view_homepage',
                'key' => 'hero_title',
                'value' => 'Solusi Terpercaya <br /> Untuk <span className="text-amber-100 drop-shadow-md">Kontainer</span> Anda',
                'type' => 'textarea',
            ],
            [
                'label' => 'Hero Description',
                'description' => 'Deskripsi hero section',
                'group' => 'view_homepage',
                'key' => 'hero_description',
                'value' => 'Kami menyediakan berbagai pilihan kontainer untuk disewa atau dibeli. Mulai dari Kontainer standar hingga Kontainer Custom sesuai kebutuhan Anda.',
                'type' => 'textarea',
            ],
            [
                'label' => 'Search Placeholder',
                'description' => 'Placeholder text untuk search bar',
                'group' => 'view_homepage',
                'key' => 'search_placeholder',
                'value' => 'Cari kontainer yang kamu butuhkan...',
                'type' => 'text',
            ],
            
            // Search Features
            [
                'label' => 'Feature 1 - Stok Tersedia',
                'description' => 'Text fitur stok tersedia',
                'group' => 'view_homepage',
                'key' => 'feature_stock_available',
                'value' => 'Stok Tersedia',
                'type' => 'text',
            ],
            [
                'label' => 'Feature 2 - Garansi Kualitas',
                'description' => 'Text fitur garansi kualitas',
                'group' => 'view_homepage',
                'key' => 'feature_quality_guarantee',
                'value' => 'Garansi Kualitas',
                'type' => 'text',
            ],
            [
                'label' => 'Feature 3 - Harga Kompetitif',
                'description' => 'Text fitur harga kompetitif',
                'group' => 'view_homepage',
                'key' => 'feature_competitive_price',
                'value' => 'Harga Kompetitif',
                'type' => 'text',
            ],
            [
                'label' => 'Feature 4 - Support 24/7',
                'description' => 'Text fitur support 24/7',
                'group' => 'view_homepage',
                'key' => 'feature_support_247',
                'value' => 'Support 24/7',
                'type' => 'text',
            ],

            // Section Titles and Descriptions
            [
                'label' => 'Layanan Kami - Title',
                'description' => 'Judul section layanan kami',
                'group' => 'view_homepage',
                'key' => 'services_title',
                'value' => 'Layanan Kami',
                'type' => 'text',
            ],
            [
                'label' => 'Layanan Kami - Description',
                'description' => 'Deskripsi section layanan kami',
                'group' => 'view_homepage',
                'key' => 'services_description',
                'value' => 'Berbagai layanan profesional yang kami tawarkan untuk memenuhi kebutuhan kontainer Anda',
                'type' => 'textarea',
            ],

            [
                'label' => 'Produk Kami - Title',
                'description' => 'Judul section produk kami',
                'group' => 'view_homepage',
                'key' => 'products_title',
                'value' => 'Produk Kami',
                'type' => 'text',
            ],
            [
                'label' => 'Produk Kami - Description',
                'description' => 'Deskripsi section produk kami',
                'group' => 'view_homepage',
                'key' => 'products_description',
                'value' => 'Temukan produk-produk kontainer untuk kebutuhanmu',
                'type' => 'textarea',
            ],

            [
                'label' => 'Klien Kami - Title',
                'description' => 'Judul section klien kami',
                'group' => 'view_homepage',
                'key' => 'clients_title',
                'value' => 'Klien Kami',
                'type' => 'text',
            ],
            [
                'label' => 'Klien Kami - Description',
                'description' => 'Deskripsi section klien kami',
                'group' => 'view_homepage',
                'key' => 'clients_description',
                'value' => 'Kami telah melayani berbagai perusahaan dan organisasi di berbagai sektor',
                'type' => 'textarea',
            ],

            [
                'label' => 'Testimoni - Title',
                'description' => 'Judul section testimoni',
                'group' => 'view_homepage',
                'key' => 'testimonials_title',
                'value' => 'Apa Kata Mereka',
                'type' => 'text',
            ],
            [
                'label' => 'Testimoni - Description',
                'description' => 'Deskripsi section testimoni',
                'group' => 'view_homepage',
                'key' => 'testimonials_description',
                'value' => 'Testimoni dari klien yang telah menggunakan layanan kami',
                'type' => 'textarea',
            ],

            [
                'label' => 'FAQ - Title',
                'description' => 'Judul section FAQ',
                'group' => 'view_homepage',
                'key' => 'faq_title',
                'value' => 'Pertanyaan yang Sering Diajukan',
                'type' => 'text',
            ],
            [
                'label' => 'FAQ - Description',
                'description' => 'Deskripsi section FAQ',
                'group' => 'view_homepage',
                'key' => 'faq_description',
                'value' => 'Temukan jawaban atas pertanyaan umum seputar layanan kami',
                'type' => 'textarea',
            ],

            [
                'label' => 'Artikel - Title',
                'description' => 'Judul section artikel',
                'group' => 'view_homepage',
                'key' => 'articles_title',
                'value' => 'Artikel Terbaru',
                'type' => 'text',
            ],
            [
                'label' => 'Artikel - Description',
                'description' => 'Deskripsi section artikel',
                'group' => 'view_homepage',
                'key' => 'articles_description',
                'value' => 'Temukan informasi terbaru seputar kontainer dan solusi logistik',
                'type' => 'textarea',
            ],

            // CTA Section
            [
                'label' => 'CTA Title',
                'description' => 'Judul call to action section',
                'group' => 'view_homepage',
                'key' => 'cta_title',
                'value' => 'Butuh Kontainer untuk Bisnis Anda?',
                'type' => 'text',
            ],
            [
                'label' => 'CTA Description',
                'description' => 'Deskripsi call to action section',
                'group' => 'view_homepage',
                'key' => 'cta_description',
                'value' => 'Dapatkan penawaran terbaik untuk sewa atau beli kontainer berkualitas. Cocok untuk berbagai kebutuhan usaha mulai dari gudang, kantor, hingga ruang komersial.',
                'type' => 'textarea',
            ],
            [
                'label' => 'CTA Button Text',
                'description' => 'Text tombol call to action',
                'group' => 'view_homepage',
                'key' => 'cta_button_text',
                'value' => 'Hubungi Kami via WhatsApp',
                'type' => 'text',
            ],
            
            // Auth Layout Configuration
            [
                'label' => 'Auth Logo',
                'description' => 'Logo untuk halaman login dan registrasi',
                'group' => 'view_homepage',
                'key' => 'auth_logo',
                'value' => '/images/logo-main.png',
                'type' => 'image',
            ],
            [
                'label' => 'Auth Background Image',
                'description' => 'Gambar latar belakang untuk halaman login',
                'group' => 'view_homepage',
                'key' => 'auth_bg_image',
                'value' => '/images/bg-hero.png',
                'type' => 'image',
            ],
        ];

        foreach ($homepageConfigs as $config) {
            Configuration::firstOrCreate(
                ['key' => $config['key'], 'group' => $config['group']],
                $config
            );
        }
    }

    /**
     * Create other configuration settings
     */
    private function createOtherConfiguration(): void
    {
        $otherConfigs = [
            [
                'label' => 'Notifikasi Email ke Owner Saat Pesanan Dibuat',
                'description' => 'Aktifkan notifikasi email ke pemilik saat pelanggan membuat pesanan baru',
                'group' => 'other',
                'key' => 'notify_email_owner_order_created',
                'value' => 'true',
                'type' => 'checkbox',
            ],
            [
                'label' => 'Notifikasi Email ke Pelanggan Saat Pesanan Berhasil',
                'description' => 'Aktifkan notifikasi email ke pelanggan saat pesanan berhasil diproses',
                'group' => 'other',
                'key' => 'notify_email_customer_order_success',
                'value' => 'true',
                'type' => 'checkbox',
            ],
            [
                'label' => 'Email Target Owner',
                'description' => 'Alamat email tujuan untuk notifikasi ke pemilik',
                'group' => 'other',
                'key' => 'target_email_address_owner',
                'value' => 'owner@alumodasinergi.com',
                'type' => 'text',
            ],
            [
                'label' => 'Prefix Order',
                'description' => 'Prefix untuk nomor pesanan (contoh: ORD)',
                'group' => 'other',
                'key' => 'prefix_product_order',
                'value' => 'ORD',
                'type' => 'text',
            ],
            [
                'label' => 'TinyMCE WYSWYG Token',
                'description' => 'Token untuk editor TinyMce WYSWYG',
                'group' => 'other',
                'key' => 'tinymce_token',
                'value' => '',
                'type' => 'text',
            ],
        ];

        foreach ($otherConfigs as $config) {
            Configuration::firstOrCreate(
                ['key' => $config['key'], 'group' => $config['group']],
                $config
            );
        }
    }
}
