import PasswordController from '@/actions/App/Http/Controllers/BackPanel/Settings/PasswordController';
import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { type BreadcrumbItem } from '@/types';
import { Transition } from '@headlessui/react';
import { Form, Head } from '@inertiajs/react';
import React, { useRef, useState } from 'react';

import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { edit } from '@/routes/settings/password';
import { Eye, EyeOff } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Pengaturan Kata Sandi',
    href: edit().url,
  },
];

export default function Password() {
  const passwordInput = useRef<HTMLInputElement>(null);
  const currentPasswordInput = useRef<HTMLInputElement>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Pengaturan Kata Sandi" />

      <SettingsLayout>
        <div className="space-y-6">
          <HeadingSmall
            title="Perbarui Kata Sandi"
            description="Pastikan akun Anda menggunakan kata sandi yang panjang dan acak untuk tetap aman"
          />

          <Form
            {...PasswordController.update.form()}
            options={{
              preserveScroll: true,
            }}
            resetOnError={['password', 'password_confirmation', 'current_password']}
            resetOnSuccess
            onError={(errors) => {
              if (errors.password) {
                passwordInput.current?.focus();
              }

              if (errors.current_password) {
                currentPasswordInput.current?.focus();
              }
            }}
            className="space-y-6"
          >
            {({ errors, processing, recentlySuccessful }) => (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="current_password">Kata sandi saat ini</Label>
                  <div className="relative">
                    <Input
                      id="current_password"
                      ref={currentPasswordInput}
                      name="current_password"
                      type={showCurrentPassword ? 'text' : 'password'}
                      className="mt-1 block w-full pr-10"
                      autoComplete="current-password"
                      placeholder="Kata sandi saat ini"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  <InputError message={errors.current_password} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="password">Kata sandi baru</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      ref={passwordInput}
                      name="password"
                      type={showNewPassword ? 'text' : 'password'}
                      className="mt-1 block w-full pr-10"
                      autoComplete="new-password"
                      placeholder="Kata sandi baru"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  <InputError message={errors.password} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="password_confirmation">Konfirmasi kata sandi</Label>
                  <div className="relative">
                    <Input
                      id="password_confirmation"
                      name="password_confirmation"
                      type={showConfirmPassword ? 'text' : 'password'}
                      className="mt-1 block w-full pr-10"
                      autoComplete="new-password"
                      placeholder="Ketik ulang kata sandi barumu"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  <InputError message={errors.password_confirmation} />
                </div>

                <div className="flex items-center gap-4">
                  <Button disabled={processing} data-test="update-password-button">
                    Simpan kata sandi
                  </Button>

                  <Transition
                    show={recentlySuccessful}
                    enter="transition ease-in-out"
                    enterFrom="opacity-0"
                    leave="transition ease-in-out"
                    leaveTo="opacity-0"
                  >
                    <p className="text-sm text-neutral-600">Tersimpan</p>
                  </Transition>
                </div>
              </>
            )}
          </Form>
        </div>
      </SettingsLayout>
    </AppLayout>
  );
}
