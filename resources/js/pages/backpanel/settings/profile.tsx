import ProfileController from '@/actions/App/Http/Controllers/BackPanel/Settings/ProfileController';
import { send } from '@/routes/verification';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Form, Head, Link, usePage } from '@inertiajs/react';
import React from 'react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit } from '@/routes/settings/profile';
import { Upload, X, User } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Pengaturan Profil',
    href: edit().url,
  },
];

export default function Profile({
  mustVerifyEmail,
  status,
}: {
  mustVerifyEmail: boolean;
  status?: string;
}) {
  const { auth } = usePage<SharedData>().props;
  const [avatarPreview, setAvatarPreview] = React.useState<string | null>(null);
  const [avatarFile, setAvatarFile] = React.useState<File | null>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  const shouldRemoveAvatar = () => {
    return avatarPreview === null && !avatarFile && auth.user.avatar !== null;
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Pengaturan Profil" />

      <SettingsLayout>
        <div className="space-y-6">
          <HeadingSmall title="Informasi Profil" description="Edit informasi profil Anda" />

          <Form
            {...ProfileController.update.form()}
            options={{
              preserveScroll: true,
            }}
            className="space-y-6"
          >
            {({ processing, recentlySuccessful, errors }) => (
              <>
                {/* Avatar Section */}
                <div className="space-y-4">
                  <Label>Avatar</Label>
                  <div className="flex items-center space-x-6">
                    <div className="flex-shrink-0">
                      {avatarPreview ? (
                        <div className="relative">
                          <img
                            src={avatarPreview}
                            alt="Avatar preview"
                            className="h-24 w-24 rounded-full object-cover border-4 border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={removeAvatar}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : auth.user.avatar ? (
                        <div className="relative">
                          <img
                            src={`/storage/${auth.user.avatar}`}
                            alt="Current avatar"
                            className="h-24 w-24 rounded-full object-cover border-4 border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={removeAvatar}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="h-24 w-24 rounded-full bg-gray-100 border-4 border-gray-200 flex items-center justify-center">
                          <User className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <Input
                        id="avatar"
                        name="avatar"
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Format: jpeg, jpg, png, gif. Maksimal: 2MB
                      </p>
                    </div>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="name">Nama Lengkap</Label>

                  <Input
                    id="name"
                    className="mt-1 block w-full"
                    defaultValue={auth.user.name}
                    name="name"
                    required
                    autoComplete="name"
                    placeholder="Nama Lengkap"
                  />

                  <InputError className="mt-2" message={errors.name} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Alamat Email</Label>

                  <Input
                    id="email"
                    type="email"
                    className={`mt-1 block w-full bg-slate-200`}
                    defaultValue={auth.user.email}
                    name="email"
                    required
                    autoComplete="username"
                    placeholder="Alamat Email"
                    readOnly
                  />

                  <InputError className="mt-2" message={errors.email} />
                </div>

                {mustVerifyEmail && auth.user.email_verified_at === null && (
                  <div>
                    <p className="text-muted-foreground -mt-4 text-sm">
                      Alamat email Anda belum terverifikasi.{' '}
                      <Link
                        href={send()}
                        as="button"
                        className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                      >
                        Klik di sini untuk mengirim ulang email verifikasi.
                      </Link>
                    </p>

                    {status === 'verification-link-sent' && (
                      <div className="mt-2 text-sm font-medium text-green-600">
                        Link verifikasi baru telah dikirim ke alamat email Anda.
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-4">
                  <Button disabled={processing} data-test="update-profile-button">
                    Simpan
                  </Button>

                  <Transition
                    show={recentlySuccessful}
                    enter="transition ease-in-out"
                    enterFrom="opacity-0"
                    leave="transition ease-in-out"
                    leaveTo="opacity-0"
                  >
                    <p className="text-sm text-neutral-600">Disimpan</p>
                  </Transition>
                </div>
                
                {/* Hidden input for avatar removal */}
                {shouldRemoveAvatar() && (
                  <input
                    type="hidden"
                    name="remove_avatar"
                    value="1"
                  />
                )}
              </>
            )}
          </Form>
        </div>

        <DeleteUser />
      </SettingsLayout>
    </AppLayout>
  );
}
