import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            {/* Header Form */}
            <div className="mb-8 text-center">
                <h2 className="text-2xl font-black text-[#2D5A27] dark:text-[#F4F4E8] uppercase tracking-tight">
                    Buka <span className="text-[#2D5A27]">Akun Baru</span>
                </h2>
                <p className="text-xs font-bold text-[#4A5D50]/60 dark:text-[#85BB65]/40 uppercase tracking-widest mt-1">
                    Start Your Wealth Tracking Journey
                </p>
            </div>

            <form onSubmit={submit}>
                {/* Name */}
                <div>
                    <InputLabel 
                        htmlFor="name" 
                        value="Nama Lengkap" 
                        className="text-[#2D5A27] dark:text-[#D1D9D0] font-bold uppercase text-xs tracking-widest"
                    />

                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full border-[#C5C5B0] dark:border-[#2D5A27] focus:border-[#2D5A27] focus:ring-[#2D5A27] bg-[#F4F4E8]/50 dark:bg-[#0D1A12] text-[#2D5A27] dark:text-[#F4F4E8]"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />

                    <InputError message={errors.name} className="mt-2 text-[#8B2E2E] font-medium" />
                </div>

                {/* Email */}
                <div className="mt-4">
                    <InputLabel 
                        htmlFor="email" 
                        value="Alamat Email" 
                        className="text-[#2D5A27] dark:text-[#D1D9D0] font-bold uppercase text-xs tracking-widest"
                    />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full border-[#C5C5B0] dark:border-[#2D5A27] focus:border-[#2D5A27] focus:ring-[#2D5A27] bg-[#F4F4E8]/50 dark:bg-[#0D1A12] text-[#2D5A27] dark:text-[#F4F4E8]"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />

                    <InputError message={errors.email} className="mt-2 text-[#8B2E2E] font-medium" />
                </div>

                {/* Password */}
                <div className="mt-4">
                    <InputLabel 
                        htmlFor="password" 
                        value="Password" 
                        className="text-[#2D5A27] dark:text-[#D1D9D0] font-bold uppercase text-xs tracking-widest"
                    />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full border-[#C5C5B0] dark:border-[#2D5A27] focus:border-[#2D5A27] focus:ring-[#2D5A27] bg-[#F4F4E8]/50 dark:bg-[#0D1A12] text-[#2D5A27] dark:text-[#F4F4E8]"
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />

                    <InputError message={errors.password} className="mt-2 text-[#8B2E2E] font-medium" />
                </div>

                {/* Confirm Password */}
                <div className="mt-4">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Konfirmasi Password"
                        className="text-[#2D5A27] dark:text-[#D1D9D0] font-bold uppercase text-xs tracking-widest"
                    />

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full border-[#C5C5B0] dark:border-[#2D5A27] focus:border-[#2D5A27] focus:ring-[#2D5A27] bg-[#F4F4E8]/50 dark:bg-[#0D1A12] text-[#2D5A27] dark:text-[#F4F4E8]"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        required
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2 text-[#8B2E2E] font-medium"
                    />
                </div>

                <div className="mt-8 flex flex-col gap-4">
                    <PrimaryButton 
                        className="w-full justify-center py-3 bg-[#2D5A27] hover:bg-[#2D5A27] dark:bg-[#2D5A27] dark:hover:bg-[#3D7A36] text-[#F4F4E8] font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-[#2D5A27]/20" 
                        disabled={processing}
                    >
                        Daftar Sekarang
                    </PrimaryButton>

                    <div className="text-center mt-2">
                        <Link
                            href={route('login')}
                            className="text-xs text-[#4A5D50] dark:text-[#85BB65]/60 hover:text-[#2D5A27] dark:hover:text-[#85BB65] transition-colors"
                        >
                            Sudah punya akun? <span className="font-bold underline decoration-[#C5C5B0]">Silakan Login</span>
                        </Link>
                    </div>
                </div>
            </form>
        </GuestLayout>
    );
}