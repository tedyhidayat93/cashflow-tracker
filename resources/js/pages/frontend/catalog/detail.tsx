import { Link } from '@inertiajs/react';
import { 
    ShoppingCart,
    Heart,
    Share2,
    Check,
    X,
    Phone,
    AlertCircle,
    Info,
    Building2,
    User,
    Mail,
    InfoIcon,
    MessageCircle,
    Facebook,
    Twitter,
    Link2,
    Instagram
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { useWishlist } from '@/hooks/useWishlist';
import FrontendLayout from '@/layouts/frontend-layout';
import ProductCard from '@/components/ProductCard';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { handleImageError } from '@/utils/image';
import { formatPrice } from '@/utils/currency';
import { getProductTypeText } from '@/utils/product';
import { useConfig } from '@/utils/config';
import { generateCatalogUrl } from '@/utils/app';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import SingleGalleryPreview from '@/components/single-gallery-preview';
import { Product } from '@/types';
import { generateRecaptcha } from '@/utils/google-recaptcha';
import SeoHead from '@/components/seo-head';
import { toast } from "sonner"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


type OrderFormData = {
  companyName: string;
  picName: string;
  phone: string;
  email: string;
  notes?: string;
};


interface DetailProps {
    product: Product;
    relatedProducts: Product[];
}

interface ImagesGalleryPreview {
    original: string;
    thumbnail: string;
}

export default function Detail({ product, relatedProducts }: DetailProps) {
    const { getConfig } = useConfig();
    const [quantity, setQuantity] = useState(1);
    const [productImages, setProductImages] = useState<ImagesGalleryPreview[]>([]);
    const [selectedImage, setSelectedImage] = useState(
        product.coverImage?.image_path || product.image_path || ''
    );
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    
    const [imageSrc, setImageSrc] = useState(() => {
        if (product.images && product.images.length > 0) {
            const coverImage = product.images.find(img => img.is_cover);
            return coverImage?.path || product.images[0].path;
        }
        return product.image_path || '';
    });

    // Effect untuk mengolah product images dari database
    useEffect(() => {
        if (product.images && product.images.length > 0) {
            // Map all images to gallery format
            const galleryImages = product.images.map(img => ({
                original: img.path,
                thumbnail: img.path
            }));
            setProductImages(galleryImages);
        } else if (product.image_path) {
            // Fallback jika tidak ada images tapi ada single image
            setProductImages([{
                original: product.image_path,
                thumbnail: product.image_path
            }]);
        }
    }, [product.images]);


    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [formData, setFormData] = useState<OrderFormData>({
        companyName: '',
        picName: '',
        phone: '',
        email: '',
        notes: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Frontend validation
        if (!formData.companyName.trim()) {
            alert('Nama Perusahaan/Instansi/Pribadi wajib diisi');
            return;
        }
        if (!formData.picName.trim()) {
            alert('Nama PIC wajib diisi');
            return;
        }
        if (!formData.phone.trim()) {
            alert('Nomor Telepon/WhatsApp wajib diisi');
            return;
        }
        if (!formData.email.trim()) {
            alert('Email wajib diisi');
            return;
        }
        if (quantity < 1) {
            alert('Jumlah pesanan minimal 1');
            return;
        }
        
        setIsSubmitting(true);
        
        try {
            
            const recaptchaToken = await generateRecaptcha(
                'product_order'
            );

            const response = await axios.post('/catalog/order', {
                company_name: formData.companyName || '',
                pic_name: formData.picName || '',
                phone: formData.phone || '',
                email: formData.email || '',
                notes: formData.notes || '',
                product_id: product.id,
                quantity: quantity,
                recaptcha_token: recaptchaToken,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': (window as any).csrfToken || '',
                },
            });

            if (response.data.success) {
                // Show success modal
                // Reset form
                setQuantity(1);
                setIsOrderModalOpen(false);
                setIsSuccessModalOpen(true);

                toast.success("Berhasil membuat pesanan.",{
                    description: 'Tim kami akan segera menghubungi Anda untuk konfirmasi lebih lanjut.'
                });
                
                setFormData({
                    companyName: '',
                    picName: '',
                    phone: '',
                    email: '',
                    notes: ''
                });
            } else {
                toast.error("Gagal membuat pesanan.",{
                    description: response.data.message || 'Silakan coba lagi untuk membuat pesanan.'
                });
                throw new Error(response.data.message || 'Gagal membuat pesanan.');
            }
        } catch (error) {
            console.error('Order submission error:', error);
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 422 && error.response?.data?.errors) {
                    // Handle validation errors
                    const errors = error.response.data.errors;
                    let errorMessage = 'Validasi gagal:\n';
                    Object.entries(errors).forEach(([field, messages]) => {
                        errorMessage += `- ${Array.isArray(messages) ? messages.join(', ') : messages}\n`;
                    });
                    alert(errorMessage);
                } else {
                    toast.error("Gagal membuat pesanan.",{
                        description: error.response?.data?.message || error.message || 'Terjadi kesalahan saat mengirim pesanan. Silakan coba lagi.'
                    });
                }
            } else {
                toast.error("Gagal membuat pesanan.",{
                    description: error instanceof Error ? error.message : 'Terjadi kesalahan saat mengirim pesanan. Silakan coba lagi.'
                });
            }
        } finally {
            setTimeout(() => {
                setIsSubmitting(false);
            }, 2000);
        }
    };
    
    // Get wishlist state and actions
    const { isInWishlist, toggleWishlistItem, wishlist } = useWishlist();
    const handleWishlistItem = (product: Product) => {
        const added = toggleWishlistItem({
            id: product.id,
            name: product.name,
            price: product.price,
            image: imageSrc || '/images/placeholder-product.svg',
            slug: product.slug
        });

        if (added) {
            toast.success("Berhasil menambahkan ke wishlist ❤️", {
                description: product.name + ' telah ditambahkan ke dalam wishlist',
            });
        } else {
            toast.success("Berhasil menghapus wishlist.", {
                description: product.name + ' telah dihapus dari wishlist',
            });
        }

        return added;
    };

    const handleQuantityChange = (value: number) => {
        const newQty = quantity + value;
        
        // Tentukan batas atas (max): jika show_stock true, batasnya adalah product.stock, jika tidak, unlimited (Infinity)
        const maxLimit = product.show_stock ? (product.stock ?? Infinity) : Infinity;

        // Pastikan qty tidak kurang dari 1 dan tidak melebihi limit
        if (newQty >= 1 && newQty <= maxLimit) {
            setQuantity(newQty);
        }
    };

    return (
        <FrontendLayout>

            <SeoHead
                title={product.meta_title || product.name}
                description={
                    product.meta_description || product.description || ''
                }
                image={product.image}
                keywords={product.tags?.join(', ') || ''}
            />

            <div className='dark:bg-gray-800'>
                <div className="container mx-auto px-4 py-8">
                    {/* Breadcrumb */}
                    <nav className="mb-6 flex max-w-xl md:max-w-full overflow-auto" aria-label="Breadcrumb">
                        <ol className="inline-flex flex-nowrap text-nowrap items-center space-x-1 md:space-x-2">
                            <li className="inline-flex items-center">
                                <Link href="/" className="text-gray-700 hover:text-primary">
                                    Beranda
                                </Link>
                            </li>
                            <li>
                                <div className="flex items-center">
                                    <span className="mx-2 text-gray-500">/</span>
                                    <Link href="/catalog" className="text-gray-700 hover:text-primary">
                                        Katalog
                                    </Link>
                                </div>
                            </li>
                            <li aria-current="page">
                                <div className="flex items-center">
                                    <span className="mx-2 text-gray-500">/</span>
                                    <span className="text-gray-500">{product.name}</span>
                                </div>
                            </li>
                        </ol>
                    </nav>

                    {/* Product Section */}
                    <div className="lg:flex lg:gap-12">
                        {/* Product Images - Sticky on scroll for better UX */}
                        <div className="lg:w-1/2 lg:sticky lg:top-32 h-fit">
                            <SingleGalleryPreview images={productImages} />
                        </div>

                        {/* Product Info */}
                        <div className="mt-8 lg:mt-0 lg:w-1/2 flex flex-col">
                            {/* Header: Badge & Title */}
                            <div className="space-y-3">
                               
                                
                                <h1 className="text-2xl xl:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
                                    {product.name}
                                </h1>
                                
                                <div className="flex items-center gap-2 divide-x">
                                    {/* Badge */}
                                    {product.is_new && (
                                        <span className="rounded-full bg-emerald-100 border border-emerald-200 px-2 py-1 text-[10px] font-bold text-emerald-800">
                                        Baru
                                        </span>
                                    )}
                                    {product.is_bestseller && (
                                        <span className="rounded-full bg-orange-100 border border-orange-200 px-2 py-1 text-[10px] font-bold text-orange-800">
                                        Terlaris
                                        </span>
                                    )}
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                                        {getProductTypeText({
                                            is_for_sell: product.is_for_sell || false,
                                            is_rent: product.is_rent || false
                                        })}
                                    </span> 
                                </div>
                            </div>

                            {/* Pricing Card */}
                            <div className="mt-6 p-4 bg-gray-50 dark:bg-slate-900/90 rounded-xl">
                                {product.show_price ? (
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-gray-900 mb-1">Harga Terbaik</span>
                                        <div className="flex items-baseline gap-3">
                                            <span className="text-xl xl:text-2xl font-black text-primary dark:text-orange-400">
                                                {formatPrice(product.price)}
                                            </span>
                                            {product.compare_at_price && Number(product.compare_at_price) > Number(product.price) && (
                                                <span className="text-lg text-gray-400 line-through decoration-red-400">
                                                    {formatPrice(product.compare_at_price)}
                                                </span>
                                            )}
                                        </div>
                                        <div className="mt-4 flex items-start gap-2 text-gray-500 dark:text-gray-300">
                                            <InfoIcon className="h-4 w-4 mt-0.5 shrink-0" />
                                            <p className="text-xs leading-normal">
                                                Harga tidak mengikat. Dapatkan estimasi biaya resmi dan jadwal ketersediaan dengan mengeklik <span className="text-primary font-semibold italic">"Pesan Sekarang"</span>.
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-2 text-gray-600 dark:text-gray-300">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg font-bold text-black dark:text-white">
                                                Hubungi Tim Sales untuk Harga Terbaik
                                            </span>
                                        </div>

                                        <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-200">
                                            Klik <span className="font-semibold text-primary">"Pesan Sekarang"</span> untuk mendapatkan 
                                            penawaran harga, ketersediaan unit, dan konsultasi langsung dari tim kami.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Selection & Actions */}
                            <div className="mt-3 border-gray-100">
                                {/* Quantity */}
                                <div className="flex gap-3 items-center mb-4">
                                    <div className="w-32">
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Jumlah</label>
                                        <div className="flex bg-white items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary/20">
                                            <button 
                                                onClick={() => handleQuantityChange(-1)}
                                                className="w-10 h-10 cursor-pointer bg-white hover:bg-gray-50 text-gray-600 transition-colors"
                                            >-</button>
                                            <input 
                                                type="text" 
                                                value={quantity} 
                                                readOnly 
                                                className="w-12 h-10 border-x border-gray-300 text-center font-bold text-gray-900 bg-white"
                                            />
                                            <button 
                                                onClick={() => handleQuantityChange(1)}
                                                className="w-10 h-10 cursor-pointer bg-white hover:bg-gray-50 text-gray-600 transition-colors"
                                            >+</button>
                                        </div>
                                    </div>
                                    {
                                        product.show_stock && (
                                            <span className={`text-sm mt-6 ${product.stock > 0 ? 'text-gray-700' : 'text-red-500 font-medium'}`}>
                                                {product.stock > 0 ? `Stok :  ${product.stock} unit` : 'Stok Habis'}
                                            </span>
                                        )
                                    }
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-end gap-6">

                                    {/* Primary Buttons */}
                                    <div className="flex-1 flex gap-3">
                                        <button
                                            onClick={() => setIsOrderModalOpen(true)}
                                            className="flex-1 h-12 cursor-pointer flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                                        >
                                            <ShoppingCart className="h-5 w-5" />
                                            Pesan Sekarang
                                        </button>
                                        <button
                                            onClick={() => handleWishlistItem(product)}
                                            className="hProduct12 w-12 cursor-pointer flex items-center justify-center rounded-lg border-2 border-gray-100 hover:bg-red-50 hover:border-red-100 transition-all group"
                                        >
                                            <Heart
                                                className={`h-6 w-6 transition-colors ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400 group-hover:text-red-400'}`}
                                            />
                                        </button>
                                        {/* SHARE BUTTON */}
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <button
                                                    className="h-12 w-12 cursor-pointer flex items-center justify-center rounded-lg border-2 border-gray-100 transition-all hover:border-blue-100 hover:bg-blue-50 group"
                                                >
                                                    <Share2 className="h-5 w-5 text-gray-400 transition-colors group-hover:text-blue-500" />
                                                </button>
                                            </DropdownMenuTrigger>

                                            <DropdownMenuContent
                                                align="end"
                                                className="w-52"
                                            >
                                                {/* WHATSAPP */}
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        const text = encodeURIComponent(
                                                            `Lihat produk ${product.name}\n${window.location.href}`
                                                        );

                                                        window.open(
                                                            `https://wa.me/?text=${text}`,
                                                            '_blank'
                                                        );
                                                    }}
                                                    className="cursor-pointer"
                                                >
                                                    <MessageCircle className="mr-2 h-4 w-4 text-green-500" />
                                                    WhatsApp
                                                </DropdownMenuItem>

                                                {/* FACEBOOK */}
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        const url = encodeURIComponent(window.location.href);

                                                        window.open(
                                                            `https://www.facebook.com/sharer/sharer.php?u=${url}`,
                                                            '_blank'
                                                        );
                                                    }}
                                                    className="cursor-pointer"
                                                >
                                                    <Facebook className="mr-2 h-4 w-4 text-blue-600" />
                                                    Facebook
                                                </DropdownMenuItem>

                                                {/* TWITTER / X */}
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        const text = encodeURIComponent(
                                                            `Lihat produk ${product.name}`
                                                        );

                                                        const url = encodeURIComponent(window.location.href);

                                                        window.open(
                                                            `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
                                                            '_blank'
                                                        );
                                                    }}
                                                    className="cursor-pointer"
                                                >
                                                    <Twitter className="mr-2 h-4 w-4 text-sky-500" />
                                                    Twitter / X
                                                </DropdownMenuItem>

                                                {/* INSTAGRAM */}
                                                <DropdownMenuItem
                                                    onClick={async () => {
                                                        await navigator.clipboard.writeText(
                                                            window.location.href
                                                        );

                                                        toast.success("Link disalin", {
                                                            description:
                                                                "Tempel link di Instagram Story atau Bio",
                                                        });
                                                    }}
                                                    className="cursor-pointer"
                                                >
                                                    <Instagram className="mr-2 h-4 w-4 text-pink-500" />
                                                    Instagram
                                                </DropdownMenuItem>

                                                {/* COPY LINK */}
                                                <DropdownMenuItem
                                                    onClick={async () => {
                                                        await navigator.clipboard.writeText(
                                                            window.location.href
                                                        );

                                                        toast.success("Link berhasil disalin", {
                                                            description: product.name,
                                                        });
                                                    }}
                                                    className="cursor-pointer"
                                                >
                                                    <Link2 className="mr-2 h-4 w-4" />
                                                    Salin Link
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            </div>

                            {/* DESCRIPTION */}
                            <div className="space-y-3 mt-6">
                                <div className="prose prose-lg max-w-none leading-relaxed prose-headings:text-black prose-p:text-black text-gray-800 dark:text-gray-100 prose-strong:text-black prose-li:text-black prose-p:mb-4 prose-headings:mb-4 prose-headings:mt-6 prose-ul:mb-4 prose-ol:mb-4 prose-blockquote:mb-4 prose-table:mb-4 [&_*]:!text-black [&_*]:!text-gray-800 dark:[&_*]:!text-gray-100 [&_*]:!border-black [&_*]:!border-gray-300 dark:[&_*]:!border-gray-600 [&_*]:!bg-transparent [&_*]:!bg-white dark:[&_*]:!bg-gray-800 [&_*]:!shadow-none [&_a]:!text-blue-600 [&_a]:!no-underline hover:[&_a]:!underline [&_img]:!max-w-full [&_img]:!h-auto [&_table]:!w-full [&_table]:!border-collapse [&_td]:!border [&_th]:!border [&_td]:!p-2 [&_th]:!p-2 [&_blockquote]:!border-l-4 [&_blockquote]:!border-gray-300 [&_blockquote]:!pl-4 [&_blockquote]:!italic [&_ul]:!list-disc [&_ol]:!list-decimal [&_ul]:!pl-5 [&_ol]:!pl-5 [&_ul_li]:!mb-2 [&_ol_li]:!mb-2 [&_code]:!bg-gray-100 [&_code]:!px-1 [&_code]:!rounded [&_pre]:!bg-gray-100 [&_pre]:!p-4 [&_pre]:!rounded [&_pre]:!overflow-x-auto [&_h1]:!text-3xl [&_h1]:!font-bold [&_h1]:!mb-4 [&_h1]:!mt-8 [&_h2]:!text-2xl [&_h2]:!font-bold [&_h2]:!mb-4 [&_h2]:!mt-6 [&_h3]:!text-xl [&_h3]:!font-bold [&_h3]:!mb-4 [&_h3]:!mt-6 [&_h4]:!text-lg [&_h4]:!font-bold [&_h4]:!mb-3 [&_h4]:!mt-4 [&_h5]:!text-base [&_h5]:!font-semibold [&_h5]:!mb-3 [&_h5]:!mt-4 [&_h6]:!text-sm [&_h6]:!font-semibold [&_h6]:!mb-3 [&_h6]:!mt-4 [&_p]:!text-base [&_p]:!leading-relaxed [&_p]:!mb-4 [&_p]:!mt-0 [&_div]:!mb-4 [&_div]:!mt-0">
                                    <div dangerouslySetInnerHTML={{ __html: product.description }} />
                                </div>
                            </div>

                            {/* ================= SPEC TABLE ================= */}
                            <div className="mt-6 space-y-4">
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                    Spesifikasi Detail
                                </h2>

                                <div className="border rounded-xl overflow-hidden">

                                    <table className="w-full text-sm">

                                    <tbody className="divide-y">

                                        {/* BASIC INFO */}
                                        {product.category && (
                                        <tr>
                                            <td className="px-4 py-3 text-gray-500">Kategori</td>
                                            <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">
                                                {product.category?.name || '-'}
                                            </td>
                                        </tr>
                                        )}
                                        {product.brand && (
                                            <tr>
                                                <td className="px-4 py-3 text-gray-500">Merek</td>
                                                <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">
                                                {product.brand.name}
                                                </td>
                                            </tr>
                                        )}


                                        {/* SPECIFICATIONS */}
                                        {product?.specific_specs?.map((spec, index) => (
                                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition">
                                            <td className="px-4 py-3 text-gray-500">
                                                {spec.label}
                                            </td>
                                            <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">
                                                {spec.value}

                                                {spec.note && (
                                                    <>
                                                        <br />
                                                        *{spec.note}
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                        ))}

                                    </tbody>

                                    </table>

                                </div>
                            </div>


                            {/* Tags/Keywords */}
                            {product.tags && product.tags.length > 0 && (
                                <div className="mt-8 flex flex-wrap gap-2">
                                    {product.tags.map((tag, index) => (
                                        <span key={index} className="text-[11px] font-medium px-2.5 py-1 bg-gray-100 text-gray-500 rounded-md hover:bg-gray-200 cursor-default transition-colors">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Related Products */}
                    {relatedProducts.length > 0 && (
                        <div className="mt-16">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Produk Terkait</h2>
                            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                {relatedProducts.map((relatedProduct) => {
                                    return <ProductCard key={relatedProduct.id} product={relatedProduct} />;
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {/* Order Modal */}
            <Dialog open={isOrderModalOpen} onClose={() => setIsOrderModalOpen(false)} className="relative z-50">
                {/* Backdrop dengan blur lebih halus */}
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" aria-hidden="true" />

                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <DialogPanel className="w-full max-w-4xl rounded-2xl bg-white dark:bg-gray-900 shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[95vh]">
                        
                        {/* SISI KIRI: Ringkasan (Review) */}
                        <div className="w-full md:w-5/12 bg-slate-50 dark:bg-gray-800/50 p-6 md:p-8 border-r border-gray-100 dark:border-gray-800 overflow-y-auto">
                            <div className="sticky top-0">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-6">
                                    Detail Pesanan
                                </h3>
                                
                                <div className="group relative rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 p-2 mb-6">
                                    <img 
                                        src={imageSrc} 
                                        alt={product.name} 
                                        className="w-full h-48 object-cover rounded-lg"
                                        onError={(e) => handleImageError(e, '/images/placeholder-product.svg', product.name)}
                                    />
                                    <div className="p-4">
                                        <h4 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">{product.name}</h4>
                                        {product.category && (
                                            <span className="inline-block mt-1 px-2 py-0.5 bg-slate-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded shadow-sm">
                                                {product.category?.name}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Pricing Display */}
                                <div className="space-y-3">
                                    {
                                        product.show_price && (
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-gray-500">Harga Satuan</span>
                                                <span className="font-medium dark:text-gray-300">{product.show_price ? formatPrice(product.price) : ''}</span>
                                            </div>
                                        )
                                    }
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500">Jumlah</span>
                                        <span className="font-medium dark:text-gray-300">x {quantity}</span>
                                    </div>
                                    <div className="pt-3 border-t border-dashed border-gray-300 dark:border-gray-700">
                                        {product.show_price ? (
                                            <div className="flex justify-between items-center">
                                                <span className="font-bold text-gray-900 dark:text-white text-lg">Total Estimasi</span>
                                                <span className="text-xl font-black text-primary dark:text-orange-400">
                                                    {formatPrice(product.price * quantity)}
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs leading-relaxed flex gap-2">
                                                <Info className="h-4 w-4 shrink-0" />
                                                <span>Harga final akan dikonfirmasi via WhatsApp/Email oleh tim kami.</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Policy Note */}
                                <div className="mt-8 p-4 rounded-xl bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30">
                                    <span className="flex items-center gap-2 font-bold text-xs text-orange-700 dark:text-orange-400 mb-2 italic">
                                        <AlertCircle className="h-3 w-3" /> Informasi Penting
                                    </span>
                                    <ul className="list-disc pl-4 space-y-1 text-[11px] text-orange-800/80 dark:text-orange-300/70">
                                        <li>Harga dapat berubah sewaktu-waktu mengikuti stok.</li>
                                        <li>Pemesanan ini bersifat pengajuan (order request).</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* SISI KANAN: Form Input */}
                        <div className="w-full md:w-7/12 p-6 md:p-8 bg-white dark:bg-gray-900 overflow-y-auto relative">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <DialogTitle className="text-2xl font-black text-gray-900 dark:text-white">Formulir Kontak</DialogTitle>
                                    <p className="text-sm text-gray-500 mt-1">Lengkapi data untuk memproses pesanan Anda.</p>
                                </div>
                                <button 
                                    onClick={() => setIsOrderModalOpen(false)}
                                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <X className="h-5 w-5 text-gray-400" />
                                </button>
                            </div>
                            
                            <form onSubmit={(e) => { e.preventDefault(); onSubmit(e); }} className="space-y-5">
                                {/* Quantity Selector Modern */}
                                <div className="p-4 bg-slate-50 dark:bg-gray-800 rounded-xl flex items-center justify-between border border-gray-100 dark:border-gray-700">
                                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Tentukan Jumlah</label>
                                    <div className="flex items-center bg-white dark:bg-gray-900 rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm overflow-hidden">
                                        <button type="button" onClick={() => handleQuantityChange(-1)} className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">-</button>
                                        <input
                                            type="text"
                                            readOnly
                                            value={quantity}
                                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                            className="w-12 text-center text-sm font-bold border-x border-gray-200 dark:border-gray-700 bg-transparent dark:text-white focus:outline-none"
                                        />
                                        <button type="button" onClick={() => handleQuantityChange(1)} className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">+</button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-5">
                                    <div className="space-y-5">
                                        {/* Nama Instansi */}
                                        <div className="space-y-2">
                                            <Label htmlFor="companyName" className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                                Nama Instansi / Pribadi <span className="text-red-500">*</span>
                                            </Label>
                                            <div className="relative">
                                                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <Input 
                                                    id="companyName"
                                                    name="companyName"
                                                    placeholder="Contoh: PT. Maju Bersama"
                                                    value={formData.companyName}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="pl-10 focus-visible:ring-primary"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* Nama PIC */}
                                            <div className="space-y-2">
                                                <Label htmlFor="picName" className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                                    Nama PIC <span className="text-red-500">*</span>
                                                </Label>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                    <Input 
                                                        id="picName"
                                                        name="picName"
                                                        placeholder="Nama lengkap Anda"
                                                        value={formData.picName}
                                                        onChange={handleInputChange}
                                                        required
                                                        className="pl-10 focus-visible:ring-primary"
                                                    />
                                                </div>
                                            </div>

                                            {/* WhatsApp / HP */}
                                            <div className="space-y-2">
                                                <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                                    WhatsApp / HP <span className="text-red-500">*</span>
                                                </Label>
                                                <div className="relative">
                                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                    <Input 
                                                        id="phone"
                                                        name="phone"
                                                        type="tel"
                                                        placeholder="0812xxxx"
                                                        value={formData.phone}
                                                        onChange={handleInputChange}
                                                        required
                                                        className="pl-10 focus-visible:ring-primary"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Alamat Email */}
                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                                Alamat Email <span className="text-red-500">*</span>
                                            </Label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <Input 
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    placeholder="nama@email.com"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="pl-10 focus-visible:ring-primary"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="notes" className="block text-[12px] font-bold uppercase tracking-widest text-gray-500 mb-2">
                                            Catatan Tambahan
                                        </label>
                                        <textarea
                                            id="notes"
                                            name="notes"
                                            rows={3}
                                            value={formData.notes || ''}
                                            onChange={handleInputChange}
                                            className="w-full rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-primary focus:border-primary text-sm transition-all shadow-sm"
                                            placeholder="Informasikan kebutuhanmu seperti spesifikasi khusus, instruksi pengiriman, dll."
                                        />
                                    </div>
                                </div>
                                
                                <div className="pt-4 flex flex-col gap-3">
                                    <Button
                                        type="submit"
                                        className={`w-full py-6 rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] font-bold text-lg ${
                                            isSubmitting ? 'animate-pulse bg-primary/90' : ''
                                        }`}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
                                                <span className="animate-pulse">Memproses...</span>
                                            </span>
                                        ) : (
                                            'Konfirmasi & Buat Pesanan'
                                        )}
                                    </Button>
                                    <p className="text-[10px] text-center text-gray-400 italic">
                                        Dengan menekan tombol, Anda setuju untuk dihubungi oleh tim sales kami.
                                    </p>
                                </div>
                            </form>
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>

            {/* Success Modal */}
            <Dialog open={isSuccessModalOpen} onClose={() => setIsSuccessModalOpen(false)} className="relative z-50">
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <DialogPanel className="w-full max-w-md rounded-lg bg-white p-6 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                            <Check className="h-6 w-6 text-green-600" aria-hidden="true" />
                        </div>
                        <div className="mt-3">
                            <DialogTitle className="text-xl font-medium text-gray-900 dark:text-white">Pesanan Berhasil Dikirim!</DialogTitle>
                            <div className="mt-2">
                                <p className="text-base text-gray-500">
                                    Terima kasih atas pesanan Anda 🙏 Kami akan segera menghubungi Anda melalui WhatsApp, telepon, atau email untuk memberikan informasi lebih lanjut.
                                </p>

                                <p className="text-base text-gray-500 mt-2">
                                    Kami juga ingin mendengar pengalaman Anda berbelanja di Alumoda. 
                                    Bagikan cerita Anda{' '}
                                    <a 
                                    href="/testimonial/send-your-testimoni" 
                                    className="text-blue-600 hover:text-blue-800 underline font-medium"
                                    >
                                    di sini
                                    </a>
                                    {' '}— ulasan Anda dapat membantu pelanggan lain membuat keputusan yang tepat.
                                </p>
                                </div>
                        </div>
                        <div className="mt-5">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsSuccessModalOpen(false);
                                    window.location.href = '/catalog';
                                }}
                                className="rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                            >
                                Tutup
                            </button>
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>
        </FrontendLayout>
    );
}