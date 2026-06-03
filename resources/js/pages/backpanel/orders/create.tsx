import React from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import HeaderTitle from '@/components/header-title';
import { type BreadcrumbItem } from '@/types';
import { ArrowLeft, Save, Package, User, Phone, Mail, MapPin, Loader } from 'lucide-react';

export default function OrderCreate() {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'CRM',
      href: '/cpanel/crm',
    },
    {
      title: 'Daftar Pesanan',
      href: '/cpanel/crm/orders',
    },
    {
      title: 'Buat',
      href: '/cpanel/crm/orders/create',
    },
  ];

  const { data, setData, post, processing, errors } = useForm({
    company_name: '',
    pic_name: '',
    phone: '',
    email: '',
    address: '',
    province: '',
    regency: '',
    district: '',
    village: '',
    postal_code: '',
    notes: '',
    product_id: 1,
    product_name: '',
    product_category: '',
    product_image: '',
    product_price: 0,
    quantity: 1,
    total_price: 0,
    status: 'pending',
    admin_notes: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData(name as keyof typeof data, value);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      const newTotal = data.product_price * newQuantity;
      setData('quantity', newQuantity);
      setData('total_price', newTotal);
    }
  };

  const handleProductPriceChange = (newPrice: number) => {
    const newTotal = newPrice * data.quantity;
    setData('product_price', newPrice);
    setData('total_price', newTotal);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/cpanel/crm/orders');
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Buat Pesanan Baru" />

      <div className="space-y-6 p-6">
        <div className="flex items-center gap-4">
          <Link href="/cpanel/crm/orders">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
          </Link>
          <HeaderTitle 
            title="Buat Pesanan Baru" 
            description="Tambahkan pesanan produk baru dari pelanggan"
          />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informasi Pelanggan
                </CardTitle>
                <CardDescription>
                  Data pemesan dan informasi kontak
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="company_name">Nama Perusahaan/Instansi/Pribadi *</Label>
                  <Input
                    id="company_name"
                    name="company_name"
                    value={data.company_name}
                    onChange={handleInputChange}
                    required
                    placeholder="Masukkan nama perusahaan atau pribadi"
                  />
                  {errors.company_name && (
                    <p className="text-sm text-red-500 mt-1">{errors.company_name}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="pic_name">Nama PIC *</Label>
                  <Input
                    id="pic_name"
                    name="pic_name"
                    value={data.pic_name}
                    onChange={handleInputChange}
                    required
                    placeholder="Masukkan nama PIC"
                  />
                  {errors.pic_name && (
                    <p className="text-sm text-red-500 mt-1">{errors.pic_name}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone">Nomor Telepon/WhatsApp *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={data.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="Masukkan nomor telepon"
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={data.email}
                    onChange={handleInputChange}
                    placeholder="Masukkan email (opsional)"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="province">Provinsi *</Label>
                    <Input
                      id="province"
                      name="province"
                      value={data.province}
                      onChange={handleInputChange}
                      required
                      placeholder="Masukkan provinsi"
                    />
                    {errors.province && (
                      <p className="text-sm text-red-500 mt-1">{errors.province}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="regency">Kabupaten/Kota *</Label>
                    <Input
                      id="regency"
                      name="regency"
                      value={data.regency}
                      onChange={handleInputChange}
                      required
                      placeholder="Masukkan kabupaten/kota"
                    />
                    {errors.regency && (
                      <p className="text-sm text-red-500 mt-1">{errors.regency}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="district">Kecamatan *</Label>
                    <Input
                      id="district"
                      name="district"
                      value={data.district}
                      onChange={handleInputChange}
                      required
                      placeholder="Masukkan kecamatan"
                    />
                    {errors.district && (
                      <p className="text-sm text-red-500 mt-1">{errors.district}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="village">Kelurahan/Desa *</Label>
                    <Input
                      id="village"
                      name="village"
                      value={data.village}
                      onChange={handleInputChange}
                      required
                      placeholder="Masukkan kelurahan/desa"
                    />
                    {errors.village && (
                      <p className="text-sm text-red-500 mt-1">{errors.village}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="postal_code">Kode Pos *</Label>
                  <Input
                    id="postal_code"
                    name="postal_code"
                    value={data.postal_code}
                    onChange={handleInputChange}
                    required
                    placeholder="Masukkan kode pos"
                  />
                  {errors.postal_code && (
                    <p className="text-sm text-red-500 mt-1">{errors.postal_code}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="address">Alamat Lengkap *</Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={data.address}
                    onChange={handleInputChange}
                    required
                    placeholder="Masukkan alamat lengkap"
                    rows={3}
                  />
                  {errors.address && (
                    <p className="text-sm text-red-500 mt-1">{errors.address}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="notes">Catatan</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={data.notes}
                    onChange={handleInputChange}
                    placeholder="Catatan tambahan (opsional)"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Product Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Informasi Produk
                </CardTitle>
                <CardDescription>
                  Detail produk yang dipesan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="product_name">Nama Produk *</Label>
                  <Input
                    id="product_name"
                    name="product_name"
                    value={data.product_name}
                    onChange={handleInputChange}
                    required
                    placeholder="Masukkan nama produk"
                  />
                  {errors.product_name && (
                    <p className="text-sm text-red-500 mt-1">{errors.product_name}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="product_category">Kategori Produk *</Label>
                  <Input
                    id="product_category"
                    name="product_category"
                    value={data.product_category}
                    onChange={handleInputChange}
                    required
                    placeholder="Masukkan kategori produk"
                  />
                  {errors.product_category && (
                    <p className="text-sm text-red-500 mt-1">{errors.product_category}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="product_image">URL Gambar Produk *</Label>
                  <Input
                    id="product_image"
                    name="product_image"
                    value={data.product_image}
                    onChange={handleInputChange}
                    required
                    placeholder="Masukkan URL gambar produk"
                  />
                  {errors.product_image && (
                    <p className="text-sm text-red-500 mt-1">{errors.product_image}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="product_price">Harga Satuan (Rp) *</Label>
                  <Input
                    id="product_price"
                    name="product_price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={data.product_price}
                    onChange={(e) => handleProductPriceChange(parseFloat(e.target.value) || 0)}
                    required
                    placeholder="Masukkan harga satuan"
                  />
                  {errors.product_price && (
                    <p className="text-sm text-red-500 mt-1">{errors.product_price}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="quantity">Jumlah *</Label>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(data.quantity - 1)}
                      className="h-8 w-8 flex items-center justify-center rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50"
                    >
                      -
                    </button>
                    <Input
                      id="quantity"
                      name="quantity"
                      type="number"
                      min="1"
                      value={data.quantity}
                      onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                      required
                      className="w-20 text-center"
                    />
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(data.quantity + 1)}
                      className="h-8 w-8 flex items-center justify-center rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>
                  {errors.quantity && (
                    <p className="text-sm text-red-500 mt-1">{errors.quantity}</p>
                  )}
                </div>

                <div>
                  <Label>Total Harga</Label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md">
                    <div className="text-lg font-bold text-gray-900">
                      Rp {data.total_price.toLocaleString('id-ID')}
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="status">Status Pesanan</Label>
                  <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pesanan Baru</SelectItem>
                      <SelectItem value="confirmed">Dikonfirmasi</SelectItem>
                      <SelectItem value="processing">Diproses</SelectItem>
                      <SelectItem value="shipped">Dikirim</SelectItem>
                      <SelectItem value="completed">Selesai</SelectItem>
                      <SelectItem value="cancelled">Dibatalkan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="admin_notes">Catatan Admin</Label>
                  <Textarea
                    id="admin_notes"
                    name="admin_notes"
                    value={data.admin_notes}
                    onChange={handleInputChange}
                    placeholder="Catatan untuk internal (opsional)"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 flex justify-end space-x-2">
            <Link href="/cpanel/crm/orders">
              <Button variant="outline">
                Batal
              </Button>
            </Link>
            <Button type="submit" disabled={processing}>
              {processing ? (
                <Loader className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              {processing ? 'Menyimpan...' : 'Simpan Pesanan'}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
