import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import HeaderTitle from '@/components/header-title';
import { type BreadcrumbItem } from '@/types';
import { ArrowLeft, Edit, Globe, Phone, Mail, MapPin, User, Calendar, Image as ImageIcon } from 'lucide-react';

interface Client {
  id: number;
  name: string;
  website?: string;
  phone?: string;
  email?: string;
  address?: string;
  pic?: string;
  image?: string;
  is_active: boolean;
  sequence: number;
  created_at: string;
  updated_at: string;
}

interface Props {
  client: Client;
}

export default function ClientShow({ client }: Props) {

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'CMS',
      href: '/cpanel/cms',
    },
    {
      title: 'Clients',
      href: '/cpanel/cms/client',
    },
    {
      title: 'Detail',
      href: `/cpanel/cms/client/${client.id}`,
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Detail Client - ${client.name}`} />

      <div className="space-y-6 p-6">
        <HeaderTitle
          title="Detail Client"
          description="Informasi lengkap klien"
        >
          <div className="flex space-x-2">
            <Link href={`/cpanel/cms/client/edit/${client.id}`}>
              <Button>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </Link>
            <Link href="/cpanel/cms/client">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </Link>
          </div>
        </HeaderTitle>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informasi Utama</CardTitle>
                <CardDescription>
                  Data klien dan informasi kontak
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Nama Klien</h4>
                      <p className="text-lg font-semibold text-gray-900">{client.name}</p>
                    </div>

                    {client.website && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Website</h4>
                        <div className="flex items-center">
                          <Globe className="h-4 w-4 text-gray-400 mr-2" />
                          <a 
                            href={client.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            {client.website}
                          </a>
                        </div>
                      </div>
                    )}

                    {client.email && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Email</h4>
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 text-gray-400 mr-2" />
                          <a 
                            href={`mailto:${client.email}`}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            {client.email}
                          </a>
                        </div>
                      </div>
                    )}

                    {client.phone && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Telepon</h4>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 text-gray-400 mr-2" />
                          <a 
                            href={`tel:${client.phone}`}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            {client.phone}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    {client.pic && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">PIC (Person in Charge)</h4>
                        <div className="flex items-center">
                          <User className="h-4 w-4 text-gray-400 mr-2" />
                          <p className="text-gray-900">{client.pic}</p>
                        </div>
                      </div>
                    )}

                    {client.address && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Alamat</h4>
                        <div className="flex items-start">
                          <MapPin className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                          <p className="text-gray-900 whitespace-pre-line">{client.address}</p>
                        </div>
                      </div>
                    )}

                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Status</h4>
                      <div>
                        {client.is_active ? (
                          <Badge variant="default" className="bg-green-100 text-green-800">Aktif</Badge>
                        ) : (
                          <Badge variant="secondary">Tidak Aktif</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Image */}
            <Card>
              <CardHeader>
                <CardTitle>Gambar Klien</CardTitle>
              </CardHeader>
              <CardContent>
                {client.image ? (
                  <img
                    src={`/storage/clients/${client.image}`}
                    alt={client.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Meta Information */}
            <Card>
              <CardHeader>
                <CardTitle>Informasi Sistem</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">ID Klien</span>
                    <span className="text-sm font-medium">#{client.id}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Urutan</span>
                    <span className="text-sm font-medium">{client.sequence}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Dibuat</span>
                    <span className="text-sm font-medium">
                      {formatDate(client.created_at)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Diperbarui</span>
                    <span className="text-sm font-medium">
                      {formatDate(client.updated_at)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
