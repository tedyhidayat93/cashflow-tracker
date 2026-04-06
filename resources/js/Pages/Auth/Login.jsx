import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            {/* Judul Halaman Login (Opsional, jika GuestLayout tidak menyediakannya) */}
            <div className="mb-8 text-center">
                <h2 className="text-2xl font-black text-[#1B3022] dark:text-[#F4F4E8] uppercase tracking-tight">
                    Otorisasi <span className="text-[#2D5A27]">Akses</span>
                </h2>
                <p className="text-xs font-bold text-[#4A5D50]/60 dark:text-[#85BB65]/40 uppercase tracking-widest mt-1">
                    Cashflow Tracker
                </p>
            </div>

            {status && (
                <div className="mb-4 text-sm font-bold text-[#2D5A27] bg-[#D8E6D1] p-3 rounded-lg border border-[#B8CBB0]">
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                <div>
                    <InputLabel 
                        htmlFor="email" 
                        value="Email" 
                        className="text-[#1B3022] dark:text-[#D1D9D0] font-bold uppercase text-[10px] tracking-widest"
                    />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full border-[#C5C5B0] dark:border-[#2D5A27] focus:border-[#2D5A27] focus:ring-[#2D5A27] bg-[#F4F4E8]/50 dark:bg-[#0D1A12] text-[#1B3022] dark:text-[#F4F4E8]"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2 text-[#8B2E2E] font-medium" />
                </div>

                <div className="mt-4">
                    <InputLabel 
                        htmlFor="password" 
                        value="Password" 
                        className="text-[#1B3022] dark:text-[#D1D9D0] font-bold uppercase text-[10px] tracking-widest"
                    />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full border-[#C5C5B0] dark:border-[#2D5A27] focus:border-[#2D5A27] focus:ring-[#2D5A27] bg-[#F4F4E8]/50 dark:bg-[#0D1A12] text-[#1B3022] dark:text-[#F4F4E8]"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2 text-[#8B2E2E] font-medium" />
                </div>

                <div className="mt-4 block">
                    <label className="flex items-center group cursor-pointer">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            className="border-[#C5C5B0] text-[#2D5A27] focus:ring-[#2D5A27]"
                            onChange={(e) =>
                                setData('remember', e.target.checked)
                            }
                        />
                        <span className="ms-2 text-sm text-[#4A5D50] dark:text-[#A8B5A7] font-medium group-hover:text-[#1B3022] dark:group-hover:text-white transition-colors">
                            Ingat sesi saya
                        </span>
                    </label>
                </div>

                <div className="mt-6 flex flex-col gap-4">
                    <PrimaryButton 
                        className="w-full justify-center py-3 bg-[#1B3022] hover:bg-[#2D5A27] dark:bg-[#2D5A27] dark:hover:bg-[#3D7A36] text-[#F4F4E8] font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-[#2D5A27]/20" 
                        disabled={processing}
                    >
                        Masuk ke Dashboard
                    </PrimaryButton>

                    <div className="flex items-center justify-between mt-2">
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-xs text-[#4A5D50] dark:text-[#85BB65]/60 underline decoration-[#C5C5B0] hover:text-[#1B3022] dark:hover:text-[#85BB65] transition-colors"
                            >
                                Lupa password?
                            </Link>
                        )}
                        
                        <Link
                            href={route('register')}
                            className="text-xs font-bold text-[#2D5A27] dark:text-[#85BB65] hover:underline"
                        >
                            Daftar Akun Baru
                        </Link>
                    </div>
                </div>
            </form>
        </GuestLayout>
    );
}