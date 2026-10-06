<?php

namespace App\Constants;

class AppMenu
{
    /**
     * Menu navigasi untuk Superadmin (CPanel / System Management).
     *
     * @return array
     */
    public static function superadmin(): array
    {
        return [
            'appName' => 'Superadmin Panel',
            'appSublabel' => 'System Administration',
            'navMain' => [
                [
                    'title' => 'Dashboard',
                    'url' => '/superadmin/dashboard',
                    'icon' => 'LayoutGrid',
                    'isActive' => request()->is('superadmin/dashboard*'),
                ],
                [
                    'title' => 'Workspace Management',
                    'url' => '/superadmin/workspaces',
                    'icon' => 'Building2',
                    'isActive' => request()->is('superadmin/workspaces*'),
                ],
                [
                    'title' => 'User & Role Management',
                    'url' => '#',
                    'icon' => 'Users',
                    'isActive' => request()->is('superadmin/users*') || request()->is('superadmin/roles*'),
                    'items' => [
                        [
                            'title' => 'Daftar Pengguna',
                            'url' => '/superadmin/users',
                            'isActive' => request()->is('superadmin/users*'),
                        ],
                        [
                            'title' => 'Role & Permission',
                            'url' => '/superadmin/roles',
                            'isActive' => request()->is('superadmin/roles*'),
                        ],
                    ],
                ],
                [
                    'title' => 'Paket & Langganan',
                    'url' => '/superadmin/subscriptions',
                    'icon' => 'CreditCard',
                    'isActive' => request()->is('superadmin/subscriptions*'),
                ],
                [
                    'title' => 'System Logs',
                    'url' => '/superadmin/logs',
                    'icon' => 'FileText',
                    'isActive' => request()->is('superadmin/logs*'),
                ],
                [
                    'title' => 'Pengaturan Sistem',
                    'url' => '/superadmin/settings',
                    'icon' => 'Settings',
                    'isActive' => request()->is('superadmin/settings*'),
                ],
            ],
            'projects' => [],
        ];
    }

    /**
     * Menu navigasi untuk Modul Cashflow Tracker.
     *
     * @param string $workspaceSlug
     * @return array
     */
    public static function cashflow(string $workspaceSlug): array
    {
        return [
            'appName' => 'Cashflow Tracker',
            'appSublabel' => 'Workspace: ' . $workspaceSlug,
            'navMain' => [
                // [
                //     'title' => 'Kembali ke Overview',
                //     'url' => '/overview',
                //     'icon' => 'ArrowLeft',
                // ],
                [
                    'title' => 'Dashboard',
                    'url' => "/w/{$workspaceSlug}/cf",
                    'icon' => 'LayoutGrid',
                    'isActive' => request()->is("w/{$workspaceSlug}/cf"),
                ],
                [
                    'title' => 'Transaksi',
                    'url' => '#',
                    'icon' => 'Receipt',
                    'isActive' => request()->is("w/{$workspaceSlug}/cf/transactions*") || request()->is("w/{$workspaceSlug}/cf/income*") || request()->is("w/{$workspaceSlug}/cf/expense*"),
                    'items' => [
                        [
                            'title' => 'Pemasukan',
                            'url' => "/w/{$workspaceSlug}/cf/income",
                            'isActive' => request()->is("w/{$workspaceSlug}/cf/income*"),
                        ],
                        [
                            'title' => 'Pengeluaran',
                            'url' => "/w/{$workspaceSlug}/cf/expense",
                            'isActive' => request()->is("w/{$workspaceSlug}/cf/expense*"),
                        ],
                        [
                            'title' => 'Semua Transaksi',
                            'url' => "/w/{$workspaceSlug}/cf/transactions",
                            'isActive' => request()->is("w/{$workspaceSlug}/cf/transactions*"),
                        ],
                    ],
                ],
                [
                    'title' => 'Kategori',
                    'url' => "/w/{$workspaceSlug}/cf/categories",
                    'icon' => 'Tag',
                    'isActive' => request()->is("w/{$workspaceSlug}/cf/categories*"),
                ],
                // [
                //     'title' => 'Dompet / Rekening',
                //     'url' => "/w/{$workspaceSlug}/cf/accounts",
                //     'icon' => 'Wallet',
                //     'isActive' => request()->is("w/{$workspaceSlug}/cf/accounts*"),
                // ],
                [
                    'title' => 'Dompet / Rekening',
                    'url' => '#',
                    'icon' => 'Wallet',
                    'isActive' => request()->is("w/{$workspaceSlug}/cf/accounts*") || request()->is("w/{$workspaceSlug}/cf/transfers*"),
                    'items' => [
                        [
                            'title' => 'Daftar Dompet',
                            'url' => "/w/{$workspaceSlug}/cf/accounts",
                            'isActive' => request()->is("w/{$workspaceSlug}/cf/accounts*"),
                        ],
                        [
                            'title' => 'Transfer',
                            'url' => "/w/{$workspaceSlug}/cf/transfers",
                            'isActive' => request()->is("w/{$workspaceSlug}/cf/transfers*"),
                        ],
                    ],
                ],
                [
                    'title' => 'Laporan Finansial',
                    'url' => "/w/{$workspaceSlug}/cf/reports",
                    'icon' => 'BarChart3',
                    'isActive' => request()->is("w/{$workspaceSlug}/cf/reports*"),
                ],
                // [
                //     'title' => 'Pengaturan Modul',
                //     'url' => "/w/{$workspaceSlug}/cf/settings",
                //     'icon' => 'Settings',
                //     'isActive' => request()->is("w/{$workspaceSlug}/cf/settings*"),
                // ],
            ],
            'projects' => [],
        ];
    }

    /**
     * Menu navigasi default jika tidak ada modul atau config yang cocok.
     *
     * @return array
     */
    public static function default(): array
    {
        return [
            'appName' => config('app.name', 'Application'),
            'appSublabel' => 'Main Workspace',
            'navMain' => [
                [
                    'title' => 'Dashboard',
                    'url' => '/dashboard',
                    'icon' => 'LayoutGrid',
                    'isActive' => request()->is('dashboard'),
                ],
                [
                    'title' => 'Overview',
                    'url' => '/overview',
                    'icon' => 'Compass',
                    'isActive' => request()->is('overview'),
                ],
            ],
            'projects' => [],
        ];
    }
}