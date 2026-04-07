import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Reset Akses - Dollar Edition" />

            {/* Header / Instruksi */}
            <div className="mb-6 text-center">
                <h2 className="text-xl font-black text-[#2D5A27] dark:text-[#F4F4E8] uppercase tracking-tight mb-2">
                    Pemulihan <span className="text-[#2D5A27]">Kredensial</span>
                </h2>
                <p className="text-[13px] leading-relaxed text-[#4A5D50] dark:text-[#A8B5A7] font-medium italic border-l-2 border-[#2D5A27] pl-4 py-1 bg-[#E8E8D5]/30 dark:bg-[#2D5A27]/20">
                    Lupa password? Masukkan alamat email Anda di bawah ini. Kami akan mengirimkan tautan pemulihan resmi untuk mengatur ulang otorisasi akses Anda.
                </p>
            </div>

            {status && (
                <div className="mb-4 text-sm font-bold text-[#2D5A27] bg-[#D8E6D1] p-3 rounded-lg border border-[#B8CBB0] animate-pulse">
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                <TextInput
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    className="mt-1 block w-full border-[#C5C5B0] dark:border-[#2D5A27] focus:border-[#2D5A27] focus:ring-[#2D5A27] bg-[#F4F4E8]/50 dark:bg-[#0D1A12] text-[#2D5A27] dark:text-[#F4F4E8]"
                    isFocused={true}
                    placeholder="Masukkan Email Terdaftar..."
                    onChange={(e) => setData('email', e.target.value)}
                />

                <InputError message={errors.email} className="mt-2 text-[#8B2E2E] font-medium" />

                <div className="mt-8">
                    <PrimaryButton 
                        className="w-full justify-center py-3.5 bg-[#2D5A27] hover:bg-[#2D5A27] dark:bg-[#2D5A27] dark:hover:bg-[#3D7A36] text-[#F4F4E8] font-black uppercase tracking-widest text-[11px] transition-all shadow-xl shadow-[#2D5A27]/20" 
                        disabled={processing}
                    >
                        Kirim Tautan Pemulihan
                    </PrimaryButton>
                </div>

                <div className="mt-6 text-center">
                    <button 
                        type="button" 
                        onClick={() => window.history.back()}
                        className="text-[10px] font-bold text-[#4A5D50] dark:text-[#85BB65]/60 hover:text-[#2D5A27] uppercase tracking-widest transition-colors"
                    >
                        ← Kembali ke halaman sebelumnya
                    </button>
                </div>
            </form>
        </GuestLayout>
    );
}