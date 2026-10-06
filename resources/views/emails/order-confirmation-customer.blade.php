<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Konfirmasi Pesanan</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,sans-serif;color:#111827;">

<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f3f4f6;padding:20px 0;">
    <tr>
        <td align="center">

            <table width="600" cellpadding="0" cellspacing="0" border="0"
                   style="background:#ffffff;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">

                <!-- HEADER -->
                <tr>
                    <td align="center" style="padding:30px 20px;border-bottom:1px solid #e5e7eb;">

                        @if(\App\Models\Configuration::getValue('site_logo'))
                            <img src="{{ asset('/storage/' . \App\Models\Configuration::getValue('site_logo')) }}"
                                 alt="Logo"
                                 style="max-height:50px;margin-bottom:10px;">
                        @endif

                        <h2 style="margin:0;font-size:22px;color:#111827;">
                            Konfirmasi Pesanan
                        </h2>

                        <p style="margin:8px 0 0;color:#6b7280;font-size:14px;">
                            Pesanan Anda telah kami terima
                        </p>
                    </td>
                </tr>

                <!-- CONTENT -->
                <tr>
                    <td style="padding:24px;">

                        <!-- SUCCESS -->
                        <table width="100%" cellpadding="0" cellspacing="0" border="0"
                               style="margin-bottom:20px;">
                            <tr>
                                <td align="center"
                                    style="background:#ecfdf5;color:#065f46;padding:14px;border-radius:6px;font-weight:bold;">
                                    Pesanan berhasil dibuat
                                </td>
                            </tr>
                        </table>

                        <!-- DETAIL PESANAN -->
                        <table width="100%" cellpadding="8" cellspacing="0" border="0"
                               style="border-collapse:collapse;margin-bottom:20px;">

                            <tr>
                                <td colspan="2"
                                    style="font-size:13px;font-weight:bold;color:#6b7280;padding-bottom:10px;">
                                    DETAIL PESANAN
                                </td>
                            </tr>

                            <tr>
                                <td width="40%" style="color:#6b7280;border-top:1px solid #f3f4f6;">
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

                            <tr>
                                <td style="color:#6b7280;border-top:1px solid #f3f4f6;">
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

                            @if($orderNote)
                            <tr>
                                <td style="color:#6b7280;border-top:1px solid #f3f4f6;">
                                    Catatan
                                </td>
                                <td style="border-top:1px solid #f3f4f6;">
                                    {{ $orderNote }}
                                </td>
                            </tr>
                            @endif

                        </table>

                        <!-- ESTIMASI -->
                        <table width="100%" cellpadding="0" cellspacing="0" border="0"
                               style="margin-bottom:20px;">
                            <tr>
                                <td align="center"
                                    style="padding:18px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;font-size:15px;font-weight:bold;">
                                    Pesanan Anda sedang ditinjau oleh tim kami
                                </td>
                            </tr>
                        </table>

                        <!-- LANGKAH -->
                        <table width="100%" cellpadding="0" cellspacing="0" border="0"
                               style="margin-bottom:20px;">
                            <tr>
                                <td style="font-size:13px;font-weight:bold;color:#6b7280;padding-bottom:10px;">
                                    LANGKAH BERIKUTNYA
                                </td>
                            </tr>

                            <tr>
                                <td style="font-size:14px;color:#374151;line-height:24px;">
                                    1. Pesanan diverifikasi maksimal 1x24 jam<br>
                                    2. Tim kami akan menghubungi Anda melalui email/telepon/whtasapp <br>
                                    3. Lalu kami akan mengirimkan informasi terkait quotation & proses pengerjaannya
                                </td>
                            </tr>
                        </table>

                        <!-- BUTTON -->
                        <table width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                                <td align="center">

                                    <a href="https://wa.me/{{ \App\Models\Configuration::getValue('contact_whatsapp') }}"
                                       style="display:inline-block;background:#111827;color:#ffffff;
                                              text-decoration:none;padding:12px 24px;
                                              border-radius:6px;font-size:14px;font-weight:bold;">
                                        Hubungi via WhatsApp
                                    </a>

                                </td>
                            </tr>
                        </table>

                    </td>
                </tr>

                <!-- FOOTER -->
                <tr>
                    <td align="center"
                        style="padding:20px;border-top:1px solid #e5e7eb;
                               font-size:12px;color:#9ca3af;line-height:20px;">

                        © {{ date('Y') }}
                        {{ \App\Models\Configuration::getValue('site_name', 'Company') }}

                        <br>

                        Email otomatis, mohon tidak dibalas

                    </td>
                </tr>

            </table>

        </td>
    </tr>
</table>

</body>
</html>
