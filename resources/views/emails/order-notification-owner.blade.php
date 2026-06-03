<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Pesanan Baru</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,sans-serif;color:#111827;">

<table width="100%" cellpadding="0" cellspacing="0" border="0"
       style="background:#f3f4f6;padding:20px 0;">

    <tr>
        <td align="center">

            <table width="600" cellpadding="0" cellspacing="0" border="0"
                   style="background:#ffffff;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">

                <!-- HEADER -->
                <tr>
                    <td align="center"
                        style="padding:30px 20px;border-bottom:1px solid #e5e7eb;">

                        @if(\App\Models\Configuration::getValue('site_logo'))
                            <img src="{{ asset('/storage/' . \App\Models\Configuration::getValue('site_logo')) }}"
                                 alt="Logo"
                                 style="max-height:50px;margin-bottom:10px;">
                        @endif

                        <h2 style="margin:0;font-size:22px;color:#111827;">
                            Pesanan Baru
                        </h2>

                        <p style="margin:8px 0 0;color:#6b7280;font-size:14px;">
                            Notifikasi pesanan dari pelanggan
                        </p>

                    </td>
                </tr>

                <!-- CONTENT -->
                <tr>
                    <td style="padding:24px;">

                        <!-- BADGE -->
                        <table width="100%" cellpadding="0" cellspacing="0" border="0"
                               style="margin-bottom:20px;">

                            <tr>
                                <td align="center"
                                    style="background:#fef3c7;color:#92400e;
                                           padding:14px;border-radius:6px;
                                           font-weight:bold;">

                                    Pesanan baru masuk

                                </td>
                            </tr>

                        </table>

                        <!-- DETAIL ORDER -->
                        <table width="100%" cellpadding="8" cellspacing="0" border="0"
                               style="border-collapse:collapse;margin-bottom:20px;">

                            <tr>
                                <td colspan="2"
                                    style="font-size:13px;font-weight:bold;
                                           color:#6b7280;padding-bottom:10px;">

                                    DETAIL PESANAN

                                </td>
                            </tr>

                            <tr>
                                <td width="40%"
                                    style="color:#6b7280;border-top:1px solid #f3f4f6;">
                                    No. Pesanan
                                </td>

                                <td style="border-top:1px solid #f3f4f6;">
                                    #{{ $orderNumber }}
                                </td>
                            </tr>

                            <tr>
                                <td style="color:#6b7280;border-top:1px solid #f3f4f6;">
                                    Tanggal
                                </td>

                                <td style="border-top:1px solid #f3f4f6;">
                                    {{ $createdAt }}
                                </td>
                            </tr>

                        </table>

                        <!-- CUSTOMER -->
                        <table width="100%" cellpadding="8" cellspacing="0" border="0"
                               style="border-collapse:collapse;margin-bottom:20px;">

                            <tr>
                                <td colspan="2"
                                    style="font-size:13px;font-weight:bold;
                                           color:#6b7280;padding-bottom:10px;">

                                    DATA PELANGGAN

                                </td>
                            </tr>

                            <tr>
                                <td width="40%"
                                    style="color:#6b7280;border-top:1px solid #f3f4f6;">
                                    Perusahaan
                                </td>

                                <td style="border-top:1px solid #f3f4f6;">
                                    {{ $companyName }}
                                </td>
                            </tr>

                            <tr>
                                <td style="color:#6b7280;border-top:1px solid #f3f4f6;">
                                    PIC
                                </td>

                                <td style="border-top:1px solid #f3f4f6;">
                                    {{ $customerName }}
                                </td>
                            </tr>

                            <tr>
                                <td style="color:#6b7280;border-top:1px solid #f3f4f6;">
                                    Email
                                </td>

                                <td style="border-top:1px solid #f3f4f6;">
                                    {{ $email }}
                                </td>
                            </tr>

                            <tr>
                                <td style="color:#6b7280;border-top:1px solid #f3f4f6;">
                                    Telepon
                                </td>

                                <td style="border-top:1px solid #f3f4f6;">
                                    {{ $phone }}
                                </td>
                            </tr>

                        </table>

                        <!-- PRODUK -->
                        <table width="100%" cellpadding="8" cellspacing="0" border="0"
                               style="border-collapse:collapse;margin-bottom:20px;">

                            <tr>
                                <td colspan="2"
                                    style="font-size:13px;font-weight:bold;
                                           color:#6b7280;padding-bottom:10px;">

                                    DETAIL PRODUK

                                </td>
                            </tr>

                            <tr>
                                <td width="40%"
                                    style="color:#6b7280;border-top:1px solid #f3f4f6;">
                                    Produk
                                </td>

                                <td style="border-top:1px solid #f3f4f6;">

                                    @if($productSlug)
                                        <a href="{{ url('/catalog/' . $productSlug) }}"
                                           style="color:#111827;text-decoration:none;">

                                            {{ $productName }}

                                        </a>
                                    @else
                                        {{ $productName }}
                                    @endif

                                </td>
                            </tr>

                            <tr>
                                <td style="color:#6b7280;border-top:1px solid #f3f4f6;">
                                    Jumlah
                                </td>

                                <td style="border-top:1px solid #f3f4f6;">
                                    {{ $quantity }} unit
                                </td>
                            </tr>

                            @if($notes)
                            <tr>
                                <td style="color:#6b7280;border-top:1px solid #f3f4f6;">
                                    Catatan
                                </td>

                                <td style="border-top:1px solid #f3f4f6;">
                                    {{ $notes }}
                                </td>
                            </tr>
                            @endif

                        </table>

                        <!-- TOTAL -->
                        <table width="100%" cellpadding="0" cellspacing="0" border="0"
                               style="margin-bottom:24px;">

                            <tr>
                                <td align="center"
                                    style="padding:20px;background:#f9fafb;
                                           border:1px solid #e5e7eb;
                                           border-radius:6px;">

                                    <div style="font-size:14px;color:#6b7280;">
                                        Total Estimasi
                                    </div>

                                    <div style="font-size:24px;
                                                font-weight:bold;
                                                margin-top:8px;
                                                color:#111827;">

                                        Rp {{ $totalPrice }}

                                    </div>

                                </td>
                            </tr>

                        </table>

                        <!-- BUTTON -->
                        <table width="100%" cellpadding="0" cellspacing="0" border="0">

                            <tr>
                                <td align="center">

                                    <a href="{{ url('/cpanel/crm/orders', $order->id) }}"
                                       style="display:inline-block;
                                              background:#111827;
                                              color:#ffffff;
                                              text-decoration:none;
                                              padding:12px 24px;
                                              border-radius:6px;
                                              font-size:14px;
                                              font-weight:bold;">

                                        Lihat Detail Pesanan

                                    </a>

                                </td>
                            </tr>

                        </table>

                    </td>
                </tr>

                <!-- FOOTER -->
                <tr>
                    <td align="center"
                        style="padding:20px;
                               border-top:1px solid #e5e7eb;
                               font-size:12px;
                               color:#9ca3af;
                               line-height:20px;">

                        © {{ date('Y') }}
                        {{ \App\Models\Configuration::getValue('site_name', 'Company') }}

                        <br>

                        Email otomatis dari sistem

                    </td>
                </tr>

            </table>

        </td>
    </tr>

</table>

</body>
</html>
