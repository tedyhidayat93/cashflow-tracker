<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Article;
use App\Models\User;
use App\Models\Category;
use Illuminate\Support\Str;

class ArticleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get or create a default author
        $author = User::firstOrCreate(
            ['email' => 'halo_aski@alumodasinergi.com'],
            [
                'name' => 'Halo ASKI',
                'password' => bcrypt('passwordHaloAski'),
            ]
        );

        // Get blog categories for proper assignment
        $categories = [
            'produk-container' => Category::where('slug', 'produk-container')->first(),
            'jenis-container' => Category::where('slug', 'jenis-container')->first(),
            'container-bekas' => Category::where('slug', 'container-bekas')->first(),
            'container-modifikasi' => Category::where('slug', 'container-modifikasi')->first(),
            'harga-container' => Category::where('slug', 'harga-container')->first(),
            'panduan-container' => Category::where('slug', 'panduan-container')->first(),
            'panduan-membeli-container' => Category::where('slug', 'panduan-membeli-container')->first(),
            'inspirasi-container' => Category::where('slug', 'inspirasi-container')->first(),
            'container-cafe' => Category::where('slug', 'container-cafe')->first(),
            'container-kantor' => Category::where('slug', 'container-kantor')->first(),
        ];

        // Sample article data - Container & Logistics Theme
        $articles = [
                [
                    'title' => 'Perbedaan Container Baru dan Bekas: Mana yang Lebih Cocok untuk Bisnis Anda?',
                    'excerpt' => 'Memahami perbedaan container baru dan bekas sangat penting sebelum membeli agar sesuai dengan kebutuhan dan anggaran bisnis.',
                    'content' => '
                        <p>Dalam industri logistik dan penyimpanan, pemilihan container menjadi salah satu keputusan penting yang dapat memengaruhi efisiensi operasional bisnis. Banyak perusahaan maupun individu sering bingung menentukan apakah harus membeli container baru atau container bekas. Container baru biasanya memiliki kondisi fisik yang lebih prima, tampilan lebih bersih, serta umur penggunaan yang lebih panjang. Namun, harga yang ditawarkan tentu lebih tinggi dibandingkan container bekas yang sudah pernah digunakan dalam aktivitas pengiriman internasional.</p>

                        <p>Di sisi lain, container bekas tetap menjadi pilihan populer karena menawarkan harga yang jauh lebih ekonomis. Banyak container bekas masih memiliki kondisi layak pakai dan cocok digunakan untuk gudang, proyek konstruksi, workshop, hingga kebutuhan modifikasi seperti cafe container dan office container. Sebelum membeli, penting untuk memeriksa kondisi lantai, dinding, pintu, serta memastikan container tidak mengalami kebocoran atau kerusakan struktural yang serius agar tetap aman digunakan dalam jangka panjang.</p>

                        <p>Baik container baru maupun bekas memiliki kelebihan masing-masing tergantung kebutuhan pengguna. Jika Anda membutuhkan tampilan profesional dan penggunaan jangka panjang, container baru dapat menjadi investasi terbaik. Namun jika fokus utama adalah efisiensi biaya, container bekas berkualitas masih sangat layak dipertimbangkan. Dengan memahami kebutuhan bisnis secara detail, Anda dapat menentukan pilihan container yang paling tepat dan menguntungkan untuk operasional perusahaan.</p>
                    ',
                    'tags' => ['container', 'container bekas', 'container baru', 'jual container'],
                    'is_headline' => true,
                ],

                [
                    'title' => 'Manfaat Menggunakan Container Sebagai Gudang Penyimpanan',
                    'excerpt' => 'Container kini banyak digunakan sebagai gudang penyimpanan karena praktis, aman, dan hemat biaya.',
                    'content' => '
                        <p>Penggunaan container sebagai gudang penyimpanan semakin populer di berbagai sektor industri. Banyak perusahaan memilih container karena proses instalasinya jauh lebih cepat dibandingkan membangun gudang permanen. Selain itu, container memiliki struktur baja yang kuat sehingga mampu melindungi barang dari hujan, panas, hingga risiko pencurian. Solusi ini sangat cocok untuk proyek konstruksi, perkebunan, maupun bisnis yang membutuhkan tempat penyimpanan sementara dengan biaya lebih efisien.</p>

                        <p>Container gudang juga memiliki fleksibilitas tinggi karena mudah dipindahkan sesuai kebutuhan lokasi operasional. Hal ini menjadi keuntungan besar bagi perusahaan yang sering berpindah area kerja atau memiliki proyek jangka pendek. Dengan tambahan ventilasi, rak penyimpanan, hingga sistem pendingin tertentu, container dapat dimodifikasi menjadi ruang penyimpanan yang nyaman dan aman untuk berbagai jenis barang seperti alat proyek, sparepart, hingga bahan baku produksi.</p>

                        <p>Dari sisi biaya, penggunaan container jauh lebih ekonomis dibandingkan pembangunan gudang konvensional. Perusahaan tidak perlu mengeluarkan biaya besar untuk konstruksi permanen dan proses perizinan yang rumit. Selain itu, container bekas berkualitas masih sangat layak digunakan sebagai gudang dengan harga yang relatif terjangkau. Oleh karena itu, container menjadi solusi penyimpanan modern yang praktis, fleksibel, dan cocok untuk berbagai kebutuhan bisnis saat ini.</p>
                    ',
                    'tags' => ['gudang container', 'container storage', 'container murah', 'container bekas'],
                    'is_headline' => true,
                ],

                [
                    'title' => 'Ukuran Container 20 Feet dan 40 Feet: Mana yang Harus Dipilih?',
                    'excerpt' => 'Memahami perbedaan ukuran container 20 feet dan 40 feet membantu menentukan pilihan terbaik sesuai kebutuhan.',
                    'content' => '
                        <p>Container 20 feet dan 40 feet merupakan dua ukuran container yang paling umum digunakan dalam industri logistik maupun penyimpanan. Container 20 feet biasanya memiliki ukuran lebih ringkas sehingga cocok digunakan untuk area terbatas atau kebutuhan penyimpanan dengan volume sedang. Sementara itu, container 40 feet menawarkan kapasitas yang jauh lebih besar sehingga ideal untuk pengiriman barang dalam jumlah banyak maupun kebutuhan gudang skala besar.</p>

                        <p>Dalam menentukan pilihan ukuran container, penting untuk mempertimbangkan jenis barang, lokasi penempatan, dan kebutuhan operasional. Container 20 feet lebih mudah dipindahkan serta memiliki biaya pengiriman yang lebih rendah dibandingkan container 40 feet. Namun jika kebutuhan utama adalah kapasitas maksimal dan efisiensi ruang penyimpanan, container 40 feet dapat memberikan keuntungan lebih besar karena mampu menampung barang dengan volume lebih tinggi.</p>

                        <p>Selain faktor kapasitas, biaya pembelian dan perawatan juga perlu diperhatikan sebelum memilih container. Harga container 40 feet umumnya lebih tinggi dibandingkan 20 feet, namun biaya tersebut sebanding dengan kapasitas tambahan yang diperoleh. Dengan memahami perbedaan keduanya secara detail, Anda dapat menentukan jenis container yang paling sesuai untuk kebutuhan bisnis, logistik, maupun proyek penyimpanan jangka panjang.</p>
                    ',
                    'tags' => ['container 20 feet', 'container 40 feet', 'ukuran container', 'jual container'],
                    'is_headline' => false,
                ],

                [
                    'title' => 'Ide Bisnis Menggunakan Container yang Sedang Populer',
                    'excerpt' => 'Container kini tidak hanya digunakan untuk logistik, tetapi juga menjadi peluang bisnis modern yang menarik.',
                    'content' => '
                        <p>Dalam beberapa tahun terakhir, container telah berkembang menjadi solusi bisnis kreatif yang banyak diminati. Tidak hanya digunakan sebagai alat pengiriman barang, container kini dimanfaatkan sebagai cafe, kantor, toko, hingga hunian modern. Konsep bisnis berbasis container dianggap lebih praktis, unik, dan memiliki tampilan industrial yang menarik perhatian pelanggan. Selain itu, waktu pembangunan yang lebih cepat membuat container menjadi pilihan favorit banyak pelaku usaha baru.</p>

                        <p>Salah satu bisnis container yang paling populer adalah cafe container dan coffee shop outdoor. Desain container yang modern dan fleksibel sangat cocok untuk menciptakan suasana estetik yang menarik bagi generasi muda. Selain cafe, banyak perusahaan juga menggunakan office container sebagai kantor proyek karena mudah dipindahkan dan memiliki biaya pembangunan yang lebih hemat dibandingkan bangunan permanen. Dengan sedikit modifikasi interior, container dapat menjadi ruang kerja yang nyaman dan profesional.</p>

                        <p>Peluang bisnis container diprediksi terus meningkat seiring perkembangan tren bangunan modular dan kebutuhan ruang fleksibel. Banyak pelaku usaha mulai melirik container karena lebih efisien, cepat digunakan, dan memiliki nilai estetika tersendiri. Dengan perencanaan desain yang tepat serta pemilihan container berkualitas, bisnis berbasis container dapat menjadi investasi menarik yang memberikan keuntungan jangka panjang.</p>
                    ',
                    'tags' => ['bisnis container', 'cafe container', 'office container', 'modifikasi container'],
                    'is_headline' => true,
                ],

                [
                    'title' => 'Tips Memilih Container Bekas Berkualitas Sebelum Membeli',
                    'excerpt' => 'Membeli container bekas memerlukan perhatian khusus agar mendapatkan unit berkualitas dan tahan lama.',
                    'content' => '
                        <p>Membeli container bekas bisa menjadi solusi hemat biaya bagi banyak bisnis dan proyek. Namun sebelum membeli, penting untuk memahami kondisi fisik container agar tidak mengalami kerugian di kemudian hari. Salah satu hal pertama yang harus diperiksa adalah struktur dinding dan atap container untuk memastikan tidak terdapat lubang, penyok parah, atau karat berlebihan yang dapat mengurangi ketahanan container terhadap cuaca dan penggunaan jangka panjang.</p>

                        <p>Selain bagian luar, kondisi lantai container juga perlu diperhatikan secara detail. Pastikan lantai masih kuat, tidak lapuk, dan tidak mengalami kerusakan akibat kelembapan atau bahan kimia tertentu. Pintu container juga harus dapat dibuka dan ditutup dengan baik karena bagian ini sangat penting untuk menjaga keamanan barang di dalam container. Jika memungkinkan, lakukan pemeriksaan langsung atau minta dokumentasi lengkap sebelum melakukan transaksi pembelian.</p>

                        <p>Memilih penjual container terpercaya juga menjadi faktor penting agar mendapatkan produk berkualitas dengan harga yang sesuai. Penjual profesional biasanya memberikan informasi detail mengenai kondisi container, riwayat penggunaan, hingga pilihan modifikasi tambahan sesuai kebutuhan pelanggan. Dengan pemeriksaan yang teliti dan memilih supplier terpercaya, Anda dapat memperoleh container bekas berkualitas yang tetap aman dan layak digunakan dalam jangka waktu lama.</p>
                    ',
                    'tags' => ['container bekas', 'tips beli container', 'jual container', 'container murah'],
                    'is_headline' => false,
                ],

                [
                    'title' => 'Container Office: Solusi Kantor Modern yang Praktis dan Fleksibel',
                    'excerpt' => 'Container office kini menjadi pilihan populer untuk kebutuhan kantor proyek dan ruang kerja modern yang efisien.',
                    'content' => '
                        <p>Container office atau kantor berbasis container kini semakin banyak digunakan oleh perusahaan konstruksi, pertambangan, logistik, hingga pelaku usaha modern yang membutuhkan ruang kerja praktis dan fleksibel. Dibandingkan membangun kantor permanen, penggunaan container office menawarkan proses instalasi yang jauh lebih cepat serta biaya yang lebih efisien. Container memiliki struktur baja yang kuat sehingga aman digunakan di berbagai kondisi lingkungan kerja, termasuk area proyek yang memiliki medan berat. Selain itu, desain container office juga dapat dimodifikasi sesuai kebutuhan perusahaan dengan tambahan pendingin ruangan, instalasi listrik, jendela kaca, hingga ruang meeting yang nyaman untuk mendukung aktivitas operasional sehari-hari.</p>

                        <p>Salah satu alasan utama meningkatnya popularitas container office adalah fleksibilitas penggunaannya yang sangat tinggi. Container dapat dipindahkan dengan mudah mengikuti lokasi proyek atau kebutuhan bisnis yang berubah sewaktu-waktu. Hal ini sangat menguntungkan bagi perusahaan yang memiliki proyek sementara di berbagai daerah karena tidak perlu membangun kantor baru setiap kali berpindah lokasi. Selain digunakan sebagai kantor proyek, banyak pelaku usaha juga memanfaatkan container office sebagai ruang administrasi, pos keamanan, ruang kerja startup, hingga kantor pemasaran. Dengan desain interior yang modern dan profesional, container office mampu memberikan kenyamanan kerja yang tidak kalah dengan bangunan konvensional.</p>

                        <p>Dari sisi investasi, container office juga memiliki nilai ekonomis yang cukup baik karena dapat digunakan dalam jangka panjang dan dimodifikasi kembali sesuai kebutuhan di masa depan. Banyak perusahaan memilih menggunakan container office karena biaya perawatan relatif rendah dan proses pembangunan tidak memerlukan waktu lama. Selain itu, konsep bangunan modular berbasis container juga semakin diminati karena dianggap lebih ramah lingkungan dan efisien. Dengan berbagai keunggulan tersebut, container office menjadi solusi modern yang tepat bagi perusahaan yang membutuhkan ruang kerja cepat, praktis, dan tetap terlihat profesional untuk menunjang kegiatan bisnis sehari-hari.</p>
                    ',
                    'tags' => ['container office', 'office container', 'kantor container', 'container proyek'],
                    'is_headline' => true,
                ],

                [
                    'title' => 'Keuntungan Menggunakan Container Sebagai Cafe dan Tempat Usaha',
                    'excerpt' => 'Cafe container menjadi tren bisnis modern karena tampil unik, hemat biaya, dan mudah menarik perhatian pelanggan.',
                    'content' => '
                        <p>Dalam beberapa tahun terakhir, konsep cafe dan tempat usaha berbasis container semakin populer di berbagai kota besar maupun area wisata. Banyak pelaku usaha tertarik menggunakan container karena memiliki desain industrial yang unik dan modern sehingga mudah menarik perhatian pelanggan, terutama generasi muda yang aktif di media sosial. Selain tampil menarik, pembangunan cafe container juga jauh lebih cepat dibandingkan bangunan konvensional karena struktur utama container sudah tersedia dan hanya memerlukan proses modifikasi tambahan sesuai konsep bisnis yang diinginkan. Hal ini membuat container menjadi pilihan ideal bagi pengusaha yang ingin membuka usaha dengan waktu pembangunan yang lebih singkat.</p>

                        <p>Selain faktor desain, penggunaan container untuk cafe dan tempat usaha juga menawarkan efisiensi biaya yang cukup besar. Pelaku usaha tidak perlu mengeluarkan biaya konstruksi permanen yang tinggi karena container dapat langsung dimodifikasi menjadi ruang usaha yang siap digunakan. Dengan tambahan interior yang tepat seperti kaca besar, area outdoor, pendingin ruangan, dan pencahayaan modern, container dapat berubah menjadi cafe estetik yang nyaman untuk pelanggan. Banyak bisnis makanan, coffee shop, toko retail, hingga booth pameran kini memanfaatkan container karena lebih fleksibel dan mudah dipindahkan ketika lokasi usaha berubah atau membutuhkan ekspansi bisnis ke area lain.</p>

                        <p>Container cafe juga memiliki nilai branding yang kuat karena konsepnya terlihat lebih kreatif dan berbeda dibandingkan tempat usaha biasa. Banyak pelanggan tertarik mengunjungi cafe container karena tampilannya unik dan cocok dijadikan tempat berkumpul maupun berfoto. Selain itu, konsep bisnis berbasis container juga dianggap lebih modern dan mengikuti tren arsitektur minimalis yang saat ini sedang populer. Dengan perencanaan desain yang tepat serta penggunaan container berkualitas, cafe dan tempat usaha berbasis container dapat menjadi investasi bisnis menarik yang mampu meningkatkan daya tarik pelanggan sekaligus memberikan keuntungan jangka panjang.</p>
                    ',
                    'tags' => ['cafe container', 'container cafe', 'bisnis container', 'modifikasi container'],
                    'is_headline' => true,
                ],

                [
                    'title' => 'Panduan Memilih Supplier Container Terpercaya untuk Kebutuhan Bisnis',
                    'excerpt' => 'Memilih supplier container terpercaya sangat penting untuk mendapatkan produk berkualitas dan layanan terbaik.',
                    'content' => '
                        <p>Memilih supplier container terpercaya merupakan langkah penting bagi perusahaan maupun individu yang ingin membeli container untuk kebutuhan bisnis, logistik, maupun proyek konstruksi. Saat ini terdapat banyak penjual container di pasaran, namun tidak semuanya menawarkan produk dengan kualitas yang baik dan layanan profesional. Oleh karena itu, calon pembeli perlu melakukan riset terlebih dahulu sebelum memutuskan bekerja sama dengan supplier tertentu. Salah satu hal yang perlu diperhatikan adalah reputasi perusahaan, pengalaman di bidang container, serta ketersediaan pilihan produk yang sesuai dengan kebutuhan pelanggan. Supplier terpercaya biasanya mampu memberikan informasi lengkap mengenai kondisi container, ukuran, hingga dokumentasi unit secara transparan.</p>

                        <p>Selain reputasi perusahaan, kualitas produk juga menjadi faktor utama yang harus diperhatikan ketika memilih supplier container. Pastikan supplier menyediakan container dengan kondisi struktur yang masih baik, bebas kebocoran, dan memiliki sistem penguncian yang aman. Banyak supplier profesional juga menawarkan layanan inspeksi langsung sehingga pelanggan dapat memeriksa kondisi container sebelum melakukan pembelian. Selain itu, supplier terpercaya biasanya menyediakan berbagai jenis container seperti dry container, reefer container, office container, hingga custom container sesuai kebutuhan proyek dan bisnis pelanggan. Hal ini tentu memberikan kemudahan karena pelanggan dapat memperoleh solusi container dalam satu tempat.</p>

                        <p>Layanan tambahan yang diberikan supplier juga menjadi nilai penting dalam menentukan pilihan terbaik. Banyak supplier container profesional menyediakan jasa pengiriman, modifikasi, perawatan, hingga konsultasi penggunaan container sesuai kebutuhan bisnis pelanggan. Dengan adanya layanan lengkap tersebut, proses pembelian container menjadi lebih praktis dan efisien. Selain itu, supplier terpercaya biasanya memberikan harga yang kompetitif serta pelayanan purna jual yang baik untuk menjaga kepuasan pelanggan dalam jangka panjang. Dengan memilih supplier container yang tepat, perusahaan dapat memperoleh produk berkualitas tinggi yang aman, tahan lama, dan mampu mendukung operasional bisnis secara optimal.</p>
                    ',
                    'tags' => ['supplier container', 'jual container', 'container terpercaya', 'container bisnis'],
                    'is_headline' => false,
                ],
            ];

        // Create category mapping for articles
        $articleCategoryMapping = [
            // Produk Container category
            0 => $categories['jenis-container']?->id, // Perbedaan Container Baru dan Bekas
            1 => $categories['produk-container']?->id, // Manfaat Menggunakan Container Sebagai Gudang Penyimpanan
            2 => $categories['jenis-container']?->id, // Ukuran Container 20 Feet dan 40 Feet
            
            // Inspirasi Container category
            3 => $categories['inspirasi-container']?->id, // Ide Bisnis Menggunakan Container
            
            // Panduan Container category
            4 => $categories['panduan-membeli-container']?->id, // Tips Memilih Container Bekas Berkualitas
            5 => $categories['container-kantor']?->id, // Container Office
            6 => $categories['container-cafe']?->id, // Keuntungan Menggunakan Container Sebagai Cafe
            7 => $categories['panduan-membeli-container']?->id, // Panduan Memilih Supplier Container
        ];

        // Create articles with randomized data
        foreach ($articles as $index => $articleData) {
            Article::create([
                'title' => $articleData['title'],
                'slug' => Str::slug($articleData['title']),
                'content' => $articleData['content'],
                'excerpt' => $articleData['excerpt'],
                'featured_image' => 'articles/article-' . ($index + 1) . '.jpg',
                'status' => 'published',
                'published_at' => now()->subDays(rand(1, 60))->subHours(rand(1, 23))->subMinutes(rand(1, 59)),
                'author_id' => $author->id,
                'category_id' => $articleCategoryMapping[$index] ?? $categories['produk-container']?->id,
                'meta_title' => $articleData['title'],
                'meta_description' => $articleData['excerpt'],
                'meta_keywords' => implode(', ', $articleData['tags']),
                'views_count' => rand(50, 5000), // Random view count between 50-5000
                'tags' => $articleData['tags'],
                'position' => $index + 1,
                'is_headline' => $articleData['is_headline'],
                'views' => rand(100, 10000), // Random views for additional tracking
            ]);
        }
    }
}
