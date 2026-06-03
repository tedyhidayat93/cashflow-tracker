import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, Star, Send, ArrowLeft, CheckCircle, Menu, X } from 'lucide-react';
import { getConfig } from '@/hooks/use-configuration';
import { handleImageError } from '@/utils/image';

interface Props {
    maxRating: number;
    minTestimonialLength: number;
    maxTestimonialLength: number;
    allowedImageTypes: string[];
    maxImageSize: number;
    siteName: string;
    siteLogo?: string;
    googleMapsEmbed?: string;
}

export default function TestimonialSubmit({ 
    maxRating, 
    minTestimonialLength, 
    maxTestimonialLength, 
    allowedImageTypes, 
    maxImageSize,
    siteName,
    siteLogo,
    googleMapsEmbed 
}: Props) {
    const { data, setData, post, processing, errors, reset, recentlySuccessful } = useForm({
        nama: '',
        keterangan: '',
        perusahaan: '',
        testimoni: '',
        rate_star: 5,
        foto_avatar: null as File | null,
    });

    const [preview, setPreview] = useState<string | null>(null);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('foto_avatar', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRatingClick = (rating: number) => {
        setData('rate_star', rating);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/testimonial/send-your-testimoni', {
            onSuccess: () => {
                // Clear form
                reset();
                setPreview(null);
                // Show success message for 4 seconds
                setShowSuccess(true);
                setTimeout(() => {
                    setShowSuccess(false);
                }, 4000);
            }
        });
    };

    const currentCharacters = data.testimoni.length;
    const isValidLength = currentCharacters >= minTestimonialLength && currentCharacters <= maxTestimonialLength;

    return (
        <>
            <Head title="Kirim Testimoni" />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
                {/* Simple Navigation */}
                <nav className="bg-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-center items-center h-16">
                            <div className="flex items-center">
                                <Link href="/" className="flex items-center gap-2">
                                    {siteLogo ? (
                                        <img 
                                            src={`/storage/${siteLogo}`} 
                                            alt={siteName}
                                            onError={handleImageError}
                                            className="h-8 w-auto max-h-8 object-contain"
                                        />
                                    ) : (
                                        <span className="text-xl font-bold text-gray-900">
                                            {siteName}
                                        </span>
                                    )}
                                </Link>
                            </div>

                        </div>
                    </div>
                </nav>

                {/* Success Message */}
                {showSuccess && (
                    <div className="max-w-4xl mx-auto px-4 py-6">
                        <Alert className="bg-green-50 border-green-200 text-green-800">
                            <CheckCircle className="h-4 w-4" />
                            <AlertDescription>
                                Terima kasih! Testimoni Anda telah berhasil dikirim dan akan ditinjau oleh tim kami.
                            </AlertDescription>
                        </Alert>
                    </div>
                )}

                {/* Main Content */}
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Form Section */}
                        <div className="lg:col-span-2">
                            <Card className="shadow-lg">
                                <CardHeader className="pb-0">
                                    <CardTitle className="text-2xl text-center">Bagikan Pengalaman Anda</CardTitle>
                                    <CardDescription className="text-center">
                                        Bantu kami dengan berbagi pengalaman kerja sama dengan ASKI
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        {/* Personal Information */}
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="nama">Nama Lengkap *</Label>
                                                <Input
                                                    id="nama"
                                                    type="text"
                                                    value={data.nama}
                                                    onChange={(e) => setData('nama', e.target.value)}
                                                    placeholder="Masukkan nama lengkap Anda"
                                                    className={errors.nama ? 'border-red-500' : ''}
                                                />
                                                {errors.nama && (
                                                    <p className="text-sm text-red-500">{errors.nama}</p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="perusahaan">Nama Perusahaan</Label>
                                                <Input
                                                    id="perusahaan"
                                                    type="text"
                                                    value={data.perusahaan}
                                                    onChange={(e) => setData('perusahaan', e.target.value)}
                                                    placeholder="Nama perusahaan (opsional)"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="keterangan">Jabatan/Posisi</Label>
                                            <Input
                                                id="keterangan"
                                                type="text"
                                                value={data.keterangan}
                                                onChange={(e) => setData('keterangan', e.target.value)}
                                                placeholder="Contoh: Project Manager, CEO, dll"
                                            />
                                        </div>

                                        {/* Rating */}
                                        <div className="space-y-2">
                                            <Label>Rating *</Label>
                                            <div className="flex items-center gap-2">
                                                <div className="flex gap-1">
                                                    {[...Array(maxRating)].map((_, index) => {
                                                        const rating = index + 1;
                                                        const isFilled = rating <= (hoveredRating || data.rate_star);
                                                        return (
                                                            <button
                                                                key={rating}
                                                                type="button"
                                                                onClick={() => handleRatingClick(rating)}
                                                                onMouseEnter={() => setHoveredRating(rating)}
                                                                onMouseLeave={() => setHoveredRating(0)}
                                                                className="transition-transform hover:scale-110"
                                                            >
                                                                <Star
                                                                    className={`h-8 w-8 ${
                                                                        isFilled
                                                                            ? 'fill-yellow-400 text-yellow-400'
                                                                            : 'text-gray-300'
                                                                    }`}
                                                                />
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                                <span className="text-sm text-gray-600">
                                                    {data.rate_star} dari {maxRating} bintang
                                                </span>
                                            </div>
                                            {errors.rate_star && (
                                                <p className="text-sm text-red-500">{errors.rate_star}</p>
                                            )}
                                        </div>

                                        {/* Testimonial */}
                                        <div className="space-y-2">
                                            <Label htmlFor="testimoni">Testimoni *</Label>
                                            <Textarea
                                                id="testimoni"
                                                value={data.testimoni}
                                                onChange={(e) => setData('testimoni', e.target.value)}
                                                placeholder="Bagikan pengalaman Anda bekerja sama dengan ASKI..."
                                                rows={6}
                                                className={`resize-none ${errors.testimoni ? 'border-red-500' : ''}`}
                                            />
                                            <div className="flex justify-between text-xs text-gray-500">
                                                <span>
                                                    Minimal {minTestimonialLength} karakter
                                                </span>
                                                <span className={isValidLength ? 'text-green-600' : 'text-red-500'}>
                                                    {currentCharacters}/{maxTestimonialLength}
                                                </span>
                                            </div>
                                            {errors.testimoni && (
                                                <p className="text-sm text-red-500">{errors.testimoni}</p>
                                            )}
                                        </div>

                                        {/* Photo Upload */}
                                        <div className="space-y-2">
                                            <Label htmlFor="foto_avatar">Foto Profil (Opsional)</Label>
                                            <div className="flex items-center gap-4">
                                                <div className="flex-shrink-0">
                                                    {preview ? (
                                                        <img
                                                            src={preview}
                                                            alt="Preview"
                                                            className="h-20 w-20 rounded-full object-cover border-2 border-gray-200"
                                                        />
                                                    ) : (
                                                        <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center border-2 border-gray-200">
                                                            <Upload className="h-8 w-8 text-gray-400" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <Input
                                                        id="foto_avatar"
                                                        type="file"
                                                        accept={allowedImageTypes.map(type => `.${type}`).join(',')}
                                                        onChange={handleFileChange}
                                                        className={errors.foto_avatar ? 'border-red-500' : ''}
                                                    />
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Format: {allowedImageTypes.join(', ')} • Maks: {maxImageSize / 1024}MB
                                                    </p>
                                                </div>
                                            </div>
                                            {errors.foto_avatar && (
                                                <p className="text-sm text-red-500">{errors.foto_avatar}</p>
                                            )}
                                        </div>

                                        {/* Submit Button */}
                                        <div className="pt-4">
                                            <Button
                                                type="submit"
                                                disabled={processing || !isValidLength}
                                                className="w-full py-3 text-lg"
                                            >
                                                {processing ? (
                                                    <span className="flex items-center gap-2">
                                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                                        Mengirim...
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-2">
                                                        <Send className="h-4 w-4" />
                                                        Kirim Testimoni
                                                    </span>
                                                )}
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Side Information */}
                        <div className="space-y-6">
                            {/* Google Maps Link */}
                            {googleMapsEmbed && (
                                <Card>
                                    <CardHeader className="pb-0">
                                        <CardTitle className="text-sm -mb-3">Beri Rating di Google Maps</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-gray-600 mb-4">
                                            Anda juga dapat memberikan rating langsung di Google Maps kami
                                        </p>
                                        {googleMapsEmbed && (
                                            <div 
                                                dangerouslySetInnerHTML={{ __html: googleMapsEmbed }}
                                                className="w-full h-48 rounded-lg overflow-hidden"
                                            />
                                        )}
                                    </CardContent>
                                </Card>
                            )}

                            {/* Guidelines */}
                            <Card>
                                <CardHeader className="pb-0">
                                    <CardTitle className="text-sm -mb-3">Panduan Testimoni</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3 py-0">
                                    <ul className="space-y-2 text-sm text-gray-600">
                                        <li>Jujur dan objektif dalam penilaian</li>
                                        <li>Fokus pada pengalaman kerja sama</li>
                                        <li>Sertakan detail spesifik jika memungkinkan</li>
                                        <li>Hindari informasi sensitif atau rahasia</li>
                                        <li>Gunakan bahasa yang sopan dan profesional</li>
                                    </ul>
                                </CardContent>
                            </Card>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
