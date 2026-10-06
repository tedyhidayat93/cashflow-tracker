<?php

namespace Database\Seeders;

use App\Enums\Cashflow\AccountType;
use App\Enums\Cashflow\CategoryType;
use App\Enums\Cashflow\WalletType;
use App\Models\Cashflow\Account;
use App\Models\Cashflow\Category;
use App\Models\Cashflow\Wallet;
use App\Models\User;
use App\Models\Workspace;
use Illuminate\Database\Seeder;

class CashflowSeeder extends Seeder
{
    public function run(): void
    {
        $workspace = Workspace::where('slug', 'tedybrenndaworkspace')->first();
        $user = User::where('email', 'tedy@gmail.com')->first();

        if (!$workspace || !$user) {
            return;
        }

        $workspaceId = $workspace->id;
        $userId = $user->id;

        // -------------------------------------------------------------
        // 1. Dompet & Rekening Rumah Tangga
        // -------------------------------------------------------------
        $wallets = [
            [
                'name' => 'Dompet Harian (Cash)',
                'type' => WalletType::CASH ?? 'cash',
                'opening_balance' => 1000000,
                'current_balance' => 1000000,
                'currency' => 'IDR',
                'icon' => 'wallet',
                'color' => '#10b981',
                'description' => 'Uang tunai untuk belanja harian/pasar',
            ],
            [
                'name' => 'BCA Utama (Gaji & Tagihan)',
                'type' => WalletType::BANK ?? 'bank',
                'opening_balance' => 15000000,
                'current_balance' => 15000000,
                'currency' => 'IDR',
                'account_number' => '8830123456',
                'bank_name' => 'Bank BCA',
                'icon' => 'building-bank',
                'color' => '#3b82f6',
                'description' => 'Rekening gajian dan pembayaran tagihan bulanan',
            ],
            [
                'name' => 'E-Wallet (GoPay/OVO/Dana)',
                'type' => WalletType::EWALLET ?? 'ewallet',
                'opening_balance' => 500000,
                'current_balance' => 500000,
                'currency' => 'IDR',
                'account_number' => '081234567890',
                'bank_name' => 'GoPay',
                'icon' => 'credit-card',
                'color' => '#f59e0b',
                'description' => 'Untuk jajan, transportasi online, dan e-commerce',
            ],
            [
                'name' => 'Tabungan Emergency Fund',
                'type' => WalletType::BANK ?? 'bank',
                'opening_balance' => 30000000,
                'current_balance' => 30000000,
                'currency' => 'IDR',
                'account_number' => '9900123456',
                'bank_name' => 'Bank Mandiri',
                'icon' => 'shield-check',
                'color' => '#06b6d4',
                'description' => 'Dana darurat keluarga',
            ],
        ];

        // foreach ($wallets as $wallet) {
        //     Wallet::firstOrCreate(
        //         ['workspace_id' => $workspaceId, 'name' => $wallet['name']],
        //         array_merge($wallet, [
        //             'workspace_id' => $workspaceId,
        //             'is_active' => true,
        //             'created_by' => $userId,
        //             'updated_by' => $userId,
        //         ])
        //     );
        // }

        // -------------------------------------------------------------
        // 2. Kategori Pemasukan & Pengeluaran Rumah Tangga
        // -------------------------------------------------------------
        $categories = [
            // Pemasukan
            [
                'name' => 'Gaji Bulanan',
                'type' => CategoryType::INCOME ?? 'income',
                'icon' => 'briefcase',
                'color' => '#10b981',
                'description' => 'Gaji pokok dan tunjangan pekerjaan',
            ],
            [
                'name' => 'Bonus & Freelance',
                'type' => CategoryType::INCOME ?? 'income',
                'icon' => 'coins',
                'color' => '#06b6d4',
                'description' => 'Pendapatan sampingan atau bonus tahunan',
            ],

            // Pengeluaran
            [
                'name' => 'Belanja Dapur & Sembako',
                'type' => CategoryType::EXPENSE ?? 'expense',
                'icon' => 'shopping-cart',
                'color' => '#ef4444',
                'description' => 'Bahan makanan, sayur, buah, dan kebutuhan dapur',
            ],
            [
                'name' => 'Tagihan & Utilitas',
                'type' => CategoryType::EXPENSE ?? 'expense',
                'icon' => 'receipt',
                'color' => '#f97316',
                'description' => 'Listrik, air (PAM), internet, dan pulsa/data',
            ],
            [
                'name' => 'Anak & Pendidikan',
                'type' => CategoryType::EXPENSE ?? 'expense',
                'icon' => 'school',
                'color' => '#8b5cf6',
                'description' => 'SPP sekolah, les, susu, dan pampers',
            ],
            [
                'name' => 'Transportasi & Bensin',
                'type' => CategoryType::EXPENSE ?? 'expense',
                'icon' => 'car',
                'color' => '#eab308',
                'description' => 'Bensin, tol, parkir, dan servis kendaraan',
            ],
            [
                'name' => 'Hiburan & Liburan',
                'type' => CategoryType::EXPENSE ?? 'expense',
                'icon' => 'ticket',
                'color' => '#ec4899',
                'description' => 'Nonton, makan di luar, dan rekreasi keluarga',
            ],
            [
                'name' => 'Kesehatan & Obat',
                'type' => CategoryType::EXPENSE ?? 'expense',
                'icon' => 'heart-pulse',
                'color' => '#14b8a6',
                'description' => 'Obat, vitamin, dan asuransi kesehatan',
            ],
        ];

        foreach ($categories as $cat) {
            Category::firstOrCreate(
                ['workspace_id' => $workspaceId, 'name' => $cat['name']],
                array_merge($cat, [
                    'workspace_id' => $workspaceId,
                    'created_by' => $userId,
                    'updated_by' => $userId,
                ])
            );
        }

        // -------------------------------------------------------------
        // 3. Akun Pos Keuangan (Chart of Accounts)
        // -------------------------------------------------------------
        // $accounts = [
        //     [
        //         'code' => '1100',
        //         'name' => 'Aset & Tabungan',
        //         'type' => AccountType::ASSET ?? 'asset',
        //         'description' => 'Total kas, rekening, dan e-wallet',
        //     ],
        //     [
        //         'code' => '2100',
        //         'name' => 'Cicilan & Utang',
        //         'type' => AccountType::LIABILITY ?? 'liability',
        //         'description' => 'Cicilan rumah (KPR), kendaraan, atau kartu kredit',
        //     ],
        //     [
        //         'code' => '3100',
        //         'name' => 'Kekayaan Bersih (Net Worth)',
        //         'type' => AccountType::EQUITY ?? 'equity',
        //         'description' => 'Total akumulasi tabungan dan aset keluarga',
        //     ],
        //     [
        //         'code' => '4100',
        //         'name' => 'Total Pendapatan Keluarga',
        //         'type' => AccountType::REVENUE ?? 'revenue',
        //         'description' => 'Gabungan seluruh penghasilan masuk',
        //     ],
        //     [
        //         'code' => '5100',
        //         'name' => 'Pengeluaran Rutin',
        //         'type' => AccountType::EXPENSE ?? 'expense',
        //         'description' => 'Pos pengeluaran operasional rumah tangga',
        //     ],
        // ];

        // foreach ($accounts as $acc) {
        //     Account::firstOrCreate(
        //         ['workspace_id' => $workspaceId, 'code' => $acc['code']],
        //         array_merge($acc, [
        //             'workspace_id' => $workspaceId,
        //             'is_active' => true,
        //             'created_by' => $userId,
        //             'updated_by' => $userId,
        //         ])
        //     );
        // }
    }
}