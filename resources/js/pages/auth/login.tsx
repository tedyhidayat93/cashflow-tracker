import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useConfig } from '@/utils/config';
import AuthLayout from '@/layouts/auth-layout';
import { store } from '@/routes/login';
import { Head, useForm } from '@inertiajs/react';
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from 'lucide-react';
import { useState } from 'react';
import { generateRecaptcha } from '@/utils/google-recaptcha';

interface LoginProps {
  status?: string;
  canResetPassword: boolean;
  canRegister: boolean;
}

export default function Login({
  status,
}: LoginProps) {

  const [showPassword, setShowPassword] = useState(false);

  const { getConfig } = useConfig();

  const form = useForm({
    email: '',
    password: '',
    remember: false,
    recaptcha_token: '',
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.processing) {
      return;
    }

    const token = await generateRecaptcha('login');

    form.transform((data) => ({
      ...data,
      recaptcha_token: token,
    }));

    form.post(store.url(), {
      preserveScroll: true,

      onFinish: () => {
        form.reset('password');
      },
    });
  };

  return (
    <AuthLayout
      title="Selamat Datang"
      description="Masuk ke dashboard untuk mengelola data, pesanan, dan aktivitas bisnis Anda."
    >
      <Head title="Log in" />

      <form
        onSubmit={submit}
        className="flex flex-col gap-6"
      >

        {/* Status */}
        {status && (
          <div className="rounded-2xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm font-medium text-green-600">
            {status}
          </div>
        )}

        {/* Welcome Badge */}
        <div className="flex items-center justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
            <ShieldCheck className="h-4 w-4" />
            Secure Login Access
          </div>
        </div>

        <div className="grid gap-5">

          {/* Email */}
          <div className="grid gap-2">

            <Label
              className="text-sm font-medium text-gray-700"
              htmlFor="email"
            >
              Email
            </Label>

            <div className="relative">

              <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

              <Input
                id="email"
                type="email"
                required
                autoFocus
                autoComplete="email"
                placeholder="nama@email.com"
                value={form.data.email}
                onChange={(e) =>
                  form.setData('email', e.target.value)
                }
                className="h-12 rounded-xl border-gray-200 bg-white pl-12 shadow-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
              />

            </div>

            <InputError message={form.errors.email} />

          </div>

          {/* Password */}
          <div className="grid gap-2">

            <Label
              className="text-sm font-medium text-gray-700"
              htmlFor="password"
            >
              Kata Sandi
            </Label>

            <div className="relative">

              <LockKeyhole className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                placeholder="Masukkan password"
                value={form.data.password}
                onChange={(e) =>
                  form.setData('password', e.target.value)
                }
                className="h-12 rounded-xl border-gray-200 bg-white pl-12 pr-12 shadow-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-700"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>

            </div>

            <InputError message={form.errors.password} />

          </div>

          {/* Remember */}
          <div className="flex items-center space-x-3">

            <Checkbox
              id="remember"
              checked={form.data.remember}
              onCheckedChange={(checked) =>
                form.setData('remember', !!checked)
              }
            />

            <Label
              className="cursor-pointer text-sm text-gray-600"
              htmlFor="remember"
            >
              Tetap login
            </Label>

          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={form.processing}
            data-test="login-button"
            className="h-12 w-full rounded-xl cursor-pointer bg-primary text-sm font-semibold shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] hover:shadow-xl hover:shadow-primary/30"
          >
            {form.processing ? (
              <>
                <Spinner />
                Memproses...
              </>
            ) : (
              'Masuk ke Dashboard'
            )}
          </Button>

        </div>

        <small className="w-full text-center text-slate-400">
          &copy; {new Date().getFullYear()}{' '}
          {getConfig(
            'site_name',
            'Alumoda Sinergi Kontainer Indonesia'
          )}
        </small>

      </form>
    </AuthLayout>
  );
}