import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Konfirmasi Keamanan - Dollar Edition" />

            {/* Header / Security Alert Style */}
            <div className="mb-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-[#2D5A27]/10 rounded-full mb-4 border border-[#2D5A27]/20">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#2D5A27]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>
                <h2 className="text-xl font-black text-[#2D5A27] dark:text-[#F4F4E8] uppercase tracking-tight mb-2">
                    Area <span className="text-[#2D5A27]">Terproteksi</span>
                </h2>
                <p className="text-[12px] leading-relaxed text-[#4A5D50] dark:text-[#A8B5A7] font-medium px-4 py-2 border border-[#C5C5B0] bg-[#F4F4E8]/50 dark:bg-[#0D1A12]/30 rounded-lg">
                    Ini adalah area aplikasi yang aman. Harap konfirmasi password Anda sebelum melanjutkan transaksi atau perubahan data.
                </p>
            </div>

            <form onSubmit={submit}>
                <div className="mt-4">
                    <InputLabel 
                        htmlFor="password" 
                        value="Password Keamanan" 
                        className="text-[#2D5A27] dark:text-[#D1D9D0] font-bold uppercase text-[10px] tracking-widest"
                    />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full border-[#C5C5B0] dark:border-[#2D5A27] focus:border-[#2D5A27] focus:ring-[#2D5A27] bg-[#F4F4E8]/50 dark:bg-[#0D1A12] text-[#2D5A27] dark:text-[#F4F4E8]"
                        isFocused={true}
                        placeholder="••••••••"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2 text-[#8B2E2E] font-medium" />
                </div>

                <div className="mt-8">
                    <PrimaryButton 
                        className="w-full justify-center py-3.5 bg-[#2D5A27] hover:bg-[#2D5A27] dark:bg-[#2D5A27] dark:hover:bg-[#3D7A36] text-[#F4F4E8] font-black uppercase tracking-widest text-[11px] transition-all shadow-xl shadow-[#2D5A27]/20" 
                        disabled={processing}
                    >
                        Buka Akses
                    </PrimaryButton>
                </div>

                <div className="mt-6 text-center">
                    <button 
                        type="button" 
                        onClick={() => window.history.back()}
                        className="text-[10px] font-bold text-[#4A5D50] dark:text-[#85BB65]/60 hover:text-[#2D5A27] uppercase tracking-widest transition-colors"
                    >
                        ← Batalkan Tindakan
                    </button>
                </div>
            </form>
        </GuestLayout>
    );
}