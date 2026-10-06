<?php

namespace Database\Seeders;

use App\Enums\AppIdentifier;
use App\Models\Permission; // Menggunakan Custom Model Permission
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Clear existing permissions
        DB::table('permissions')->delete();

        // Mengelompokkan permission berdasarkan grup untuk mengisi group_name dan description otomatis
        $permissionGroups = [
            'Dashboard' => [
                'dashboard-view' => 'Melihat halaman utama dashboard',
            ],
            'Workspace Management' => [
                'workspace-list'   => 'Melihat daftar workspace',
                'workspace-create' => 'Membuat workspace baru',
                'workspace-edit'   => 'Mengubah data workspace',
                'workspace-delete' => 'Menghapus workspace',
            ],
            'Workspace Users' => [
                'workspace-user-list'   => 'Melihat daftar pengguna di workspace',
                'workspace-user-invite' => 'Mengundang pengguna baru ke workspace',
                'workspace-user-edit'   => 'Mengubah peran atau izin pengguna workspace',
                'workspace-user-remove' => 'Mengeluarkan pengguna dari workspace',
            ],
            'Wallets' => [
                'wallet-list'   => 'Melihat daftar dompet/rekening',
                'wallet-create' => 'Membuat dompet/rekening baru',
                'wallet-edit'   => 'Mengubah data dompet/rekening',
                'wallet-delete' => 'Menghapus dompet/rekening',
            ],
            'Wallet Transfers' => [
                'wallet-transfer-list'   => 'Melihat riwayat transfer antar dompet',
                'wallet-transfer-create' => 'Melakukan transfer antar dompet',
                'wallet-transfer-detail' => 'Melihat rincian transaksi transfer',
            ],
            'Categories' => [
                'category-list'   => 'Melihat daftar kategori transaksi',
                'category-create' => 'Membuat kategori transaksi baru',
                'category-edit'   => 'Mengubah data kategori',
                'category-delete' => 'Menghapus kategori',
            ],
            'Budgets' => [
                'budget-list'   => 'Melihat daftar anggaran',
                'budget-create' => 'Membuat anggaran baru',
                'budget-edit'   => 'Mengubah data anggaran',
                'budget-delete' => 'Menghapus anggaran',
            ],
            'Transactions' => [
                'transaction-list'   => 'Melihat daftar transaksi',
                'transaction-create' => 'Mencatat transaksi baru',
                'transaction-edit'   => 'Mengubah data transaksi',
                'transaction-delete' => 'Menghapus data transaksi',
            ],
            'Recurring Transactions' => [
                'recurring-transaction-list'   => 'Melihat daftar transaksi berulang',
                'recurring-transaction-create' => 'Membuat jadwal transaksi berulang',
                'recurring-transaction-edit'   => 'Mengubah jadwal transaksi berulang',
                'recurring-transaction-delete' => 'Menghapus jadwal transaksi berulang',
            ],
            'Roles & Permissions' => [
                'role-list'   => 'Melihat daftar peran dan izin',
                'role-create' => 'Membuat peran baru',
                'role-edit'   => 'Mengubah peran dan alokasi izin',
                'role-delete' => 'Menghapus peran',
            ],
            'Activity Logs' => [
                'log-activity-list' => 'Melihat catatan log aktivitas sistem',
            ],
        ];

        foreach ($permissionGroups as $groupName => $permissions) {
            foreach ($permissions as $name => $description) {
                Permission::create([
                    'name'        => $name,
                    'guard_name'  => 'web',
                    'type'        => 'system',
                    'code'        => Str::upper(Str::slug($name, '_')), // Contoh: 'DASHBOARD_VIEW'
                    'app_prefix'  => AppIdentifier::CASHFLOW,
                    'group_name'  => $groupName,
                    'description' => $description,
                    'is_default'  => false,
                    'is_active'   => true,
                ]);
            }
        }
    }
}