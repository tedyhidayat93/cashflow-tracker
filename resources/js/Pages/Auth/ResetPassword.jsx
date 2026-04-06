import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Pembaruan Kredensial - Dollar Edition" />

            {/* Header: Update Kunci Akses */}
            <div className="mb-8 text-center">
                <h2 className="text-2xl font-black text-[#1B3022] dark:text-[#F4F4E8] uppercase tracking-tight">
                    Reset <span className="text-[#2D5A27]">Kunci Akses</span>
                </h2>
                <p className="text-xs font-bold text-[#4A5D50]/60 dark:text-[#85BB65]/40 uppercase tracking-widest mt-1">
                    Secure Credential Update
                </p>
            </div>

            <form onSubmit={submit}>
                {/* Email (Read-only look) */}
                <div>
                    <InputLabel 
                        htmlFor="email" 
                        value="Email Terverifikasi" 
                        className="text-[#1B3022] dark:text-[#D1D9D0] font-bold uppercase text-[10px] tracking-widest"
                    />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full border-[#C5C5B0] dark:border-[#2D5A27] opacity-70 bg-[#E8E8D5]/50 dark:bg-[#0D1A12] text-[#1B3022] dark:text-[#F4F4E8] cursor-not-allowed"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        readOnly
                    />

                    <InputError message={errors.email} className="mt-2 text-[#8B2E2E]" />
                </div>

                {/* New Password */}
                <div className="mt-4">
                    <InputLabel 
                        htmlFor="password" 
                        value="Password Baru" 
                        className="text-[#1B3022] dark:text-[#D1D9D0] font-bold uppercase text-[10px] tracking-widest"
                    />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full border-[#C5C5B0] dark:border-[#2D5A27] focus:border-[#2D5A27] focus:ring-[#2D5A27] bg-[#F4F4E8]/50 dark:bg-[#0D1A12] text-[#1B3022] dark:text-[#F4F4E8]"
                        autoComplete="new-password"
                        isFocused={true}
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2 text-[#8B2E2E]" />
                </div>

                {/* Confirm Password */}
                <div className="mt-4">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Konfirmasi Password Baru"
                        className="text-[#1B3022] dark:text-[#D1D9D0] font-bold uppercase text-[10px] tracking-widest"
                    />

                    <TextInput
                        type="password"
                        id="password_confirmation"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full border-[#C5C5B0] dark:border-[#2D5A27] focus:border-[#2D5A27] focus:ring-[#2D5A27] bg-[#F4F4E8]/50 dark:bg-[#0D1A12] text-[#1B3022] dark:text-[#F4F4E8]"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2 text-[#8B2E2E]"
                    />
                </div>

                {/* Submit Action */}
                <div className="mt-8">
                    <PrimaryButton 
                        className="w-full justify-center py-3.5 bg-[#1B3022] hover:bg-[#2D5A27] dark:bg-[#2D5A27] dark:hover:bg-[#3D7A36] text-[#F4F4E8] font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-[#2D5A27]/20" 
                        disabled={processing}
                    >
                        Perbarui Kredensial Sekarang
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}