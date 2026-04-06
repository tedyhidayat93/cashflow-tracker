import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Verifikasi Akreditasi - Dollar Edition" />

            {/* Header: Status Verifikasi */}
            <div className="mb-8 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-[#2D5A27]/10 rounded-full mb-4 border border-[#2D5A27]/20">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#2D5A27]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                </div>
                <h2 className="text-xl font-black text-[#1B3022] dark:text-[#F4F4E8] uppercase tracking-tight">
                    Verifikasi <span className="text-[#2D5A27]">Identitas</span>
                </h2>
            </div>

            <div className="mb-6 text-[13px] leading-relaxed text-[#4A5D50] dark:text-[#A8B5A7] font-medium px-4 py-3 border-l-4 border-[#2D5A27] bg-[#F4F4E8]/80 dark:bg-[#0D1A12]/40 rounded-r-lg">
                Terima kasih telah bergabung! Sebelum memulai transaksi, harap verifikasi alamat email Anda melalui tautan resmi yang baru saja kami kirimkan. Jika Anda tidak menerima korespondensi tersebut, kami akan mengirimkan ulang.
            </div>

            {status === 'verification-link-sent' && (
                <div className="mb-6 text-sm font-bold text-[#2D5A27] bg-[#D8E6D1] p-3 rounded-lg border border-[#B8CBB0] animate-pulse">
                    Tautan verifikasi baru telah dikirimkan ke alamat email yang Anda daftarkan.
                </div>
            )}

            <form onSubmit={submit}>
                <div className="mt-8 flex flex-col gap-4">
                    <PrimaryButton 
                        className="w-full justify-center py-3.5 bg-[#1B3022] hover:bg-[#2D5A27] dark:bg-[#2D5A27] dark:hover:bg-[#3D7A36] text-[#F4F4E8] font-black uppercase tracking-widest text-[11px] transition-all shadow-xl shadow-[#2D5A27]/20" 
                        disabled={processing}
                    >
                        Kirim Ulang Email Verifikasi
                    </PrimaryButton>

                    <div className="text-center">
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="text-[10px] font-bold text-[#8B2E2E] dark:text-red-400/70 hover:text-red-600 uppercase tracking-[0.2em] transition-colors underline decoration-red-200"
                        >
                            Log Out dari Sesi Ini
                        </Link>
                    </div>
                </div>
            </form>
        </GuestLayout>
    );
}