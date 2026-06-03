<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Client;

class ClientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $clients = [
            [
                'name' => 'PT. GRAHA SEGARA',
                'website' => 'https://grahasegara.co.id/',
                'phone' => null,
                'email' => null,
                'address' => null,
                'pic' => null,
                'image' => 'alumoda-sinergi-indonesia-09-12-2020-parnter-.jpeg',
                'is_active' => true,
                'sequence' => 1,
            ],
            [
                'name' => 'PT. TRAKINDO UTAMA',
                'website' => 'https://www.trakindo.co.id/en',
                'phone' => null,
                'email' => null,
                'address' => null,
                'pic' => null,
                'image' => 'alumoda-sinergi-indonesia-09-12-2020-parnter-11.jpg',
                'is_active' => true,
                'sequence' => 2,
            ],
            [
                'name' => 'PT WIKA',
                'website' => 'https://www.wika.co.id/id/',
                'phone' => null,
                'email' => null,
                'address' => null,
                'pic' => null,
                'image' => 'alumoda-sinergi-indonesia-09-12-2020-parnter-12.jpg',
                'is_active' => true,
                'sequence' => 3,
            ],
            [
                'name' => 'PT. WASKITA',
                'website' => 'https://www.waskita.co.id/?lang=id',
                'phone' => null,
                'email' => null,
                'address' => null,
                'pic' => null,
                'image' => 'alumoda-sinergi-indonesia-09-12-2020-parnter-8.png',
                'is_active' => true,
                'sequence' => 4,
            ],
            [
                'name' => 'PT. PAHALA KENCANA',
                'website' => 'https://pahalakencana.co.id/',
                'phone' => null,
                'email' => null,
                'address' => null,
                'pic' => null,
                'image' => 'alumoda-sinergi-indonesia-09-12-2020-parnter-10.jpg',
                'is_active' => true,
                'sequence' => 5,
            ],
            [
                'name' => 'PT. TOYOTA',
                'website' => 'https://www.toyota.astra.co.id/',
                'phone' => null,
                'email' => null,
                'address' => null,
                'pic' => null,
                'image' => 'alumoda-sinergi-indonesia-09-12-2020-parnter-9.jpg',
                'is_active' => true,
                'sequence' => 6,
            ],
            [
                'name' => 'PT. SHIMIZU SBCK – JO',
                'website' => 'https://www.shimz-global.com/id/en/about/offices/',
                'phone' => null,
                'email' => null,
                'address' => null,
                'pic' => null,
                'image' => 'alumoda-sinergi-indonesia-09-12-2020-parnter-8.jpg',
                'is_active' => true,
                'sequence' => 7,
            ],
            [
                'name' => 'PT. CIPTA KRIDABAHARI',
                'website' => 'https://www.ckb.co.id/',
                'phone' => null,
                'email' => null,
                'address' => null,
                'pic' => null,
                'image' => 'alumoda-sinergi-indonesia-09-12-2020-parnter-7.jpg',
                'is_active' => true,
                'sequence' => 8,
            ],
            [
                'name' => 'PT. CIPTA KRIDATAMA',
                'website' => 'https://www.ciptakridatama.co.id/',
                'phone' => null,
                'email' => null,
                'address' => null,
                'pic' => null,
                'image' => 'alumoda-sinergi-indonesia-09-12-2020-parnter-6.jpg',
                'is_active' => true,
                'sequence' => 9,
            ],
            [
                'name' => 'PT. SEWATAMA',
                'website' => 'https://sewatama.com/',
                'phone' => null,
                'email' => null,
                'address' => null,
                'pic' => null,
                'image' => 'alumoda-sinergi-indonesia-09-12-2020-parnter-5.jpg',
                'is_active' => true,
                'sequence' => 10,
            ],
            [
                'name' => 'PT. THIESS CONTRACTOR',
                'website' => 'https://www.thiess.com/id-id',
                'phone' => null,
                'email' => null,
                'address' => null,
                'pic' => null,
                'image' => 'alumoda-sinergi-indonesia-09-12-2020-parnter-7.png',
                'is_active' => true,
                'sequence' => 11,
            ],
            [
                'name' => 'PT. BAUER PRATAMA INDONESIA',
                'website' => 'http://www.bauer.co.id/en/',
                'phone' => null,
                'email' => null,
                'address' => null,
                'pic' => null,
                'image' => 'alumoda-sinergi-indonesia-09-12-2020-parnter-6.png',
                'is_active' => true,
                'sequence' => 12,
            ],
            [
                'name' => 'PT. BLUE BIRD',
                'website' => 'https://www.bluebirdgroup.com/id/',
                'phone' => null,
                'email' => null,
                'address' => null,
                'pic' => null,
                'image' => 'alumoda-sinergi-indonesia-09-12-2020-parnter-4.jpg',
                'is_active' => true,
                'sequence' => 13,
            ],
            [
                'name' => 'PT. ODG WORDMALD INDONESIA',
                'website' => 'http://www.ptodg.com/#/home',
                'phone' => null,
                'email' => null,
                'address' => null,
                'pic' => null,
                'image' => 'alumoda-sinergi-indonesia-09-12-2020-parnter-5.png',
                'is_active' => true,
                'sequence' => 14,
            ],
            [
                'name' => 'PT. UNITED TRACTOR',
                'website' => 'https://www.unitedtractors.com/',
                'phone' => null,
                'email' => null,
                'address' => null,
                'pic' => null,
                'image' => 'alumoda-sinergi-indonesia-09-12-2020-parnter-4.png',
                'is_active' => true,
                'sequence' => 15,
            ],
        ];

        foreach ($clients as $clientData) {
            Client::create($clientData);
        }
    }
}
