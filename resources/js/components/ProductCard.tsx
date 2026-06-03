import { useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';
import { formatPrice } from '@/utils/currency';
import { getProductTypeText } from '@/utils/product';
import PlaceholderImage from '@/assets/images/placeholder.png';
import { ShoppingBag, Star, ArrowRight, Tag, Eye, InfoIcon } from 'lucide-react';
import type { Product } from '@/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';




interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [imageSrc, setImageSrc] = useState<string>(product?.image || product?.image_path || product?.coverImage?.image_path || '');

    const handleImageError = () => {
        if (imageSrc !== PlaceholderImage) {
            setImageSrc(PlaceholderImage);
        }
    };

    return (
        <Link href={`/catalog/${product.slug}`}>
            <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-white dark:bg-slate-900 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                {/* Image */}
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl dark:bg-slate-800 p-3">
                    {/* Skeleton */}
                    {!isImageLoaded && (
                    <div className="absolute inset-0 bg-slate-200 dark:bg-slate-700 animate-pulse" />
                    )}

                    {/* Image */}
                    <img
                    src={imageSrc}
                    alt={product.name}
                    className={`h-full w-full object-cover rounded-lg transition-all duration-500 ${
                        isImageLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    onLoad={() => setIsImageLoaded(true)}
                    onError={handleImageError}
                    loading="lazy"
                    />

                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col px-4 pb-3 relative">

                    {product.is_featured && (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                            <Star className="absolute right-3 top-1 my-auto h-4 w-4 text-yellow-500 cursor-help" />
                            </TooltipTrigger>

                            <TooltipContent>
                            <p className='text-black font-bold'>Disarankan untukmu</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    )}

                    {/* Title */}
                    <Link href={`/catalog/${product.slug}`}>
                        <h3 className="text-base leading-[1] mb-1 font-semibold text-slate-900 dark:text-white line-clamp-2 group-hover:text-orange-500 transition-colors">
                            {product.name}
                        </h3>
                    </Link>


                    {/* Category */}
                    {product.category && (
                    <p className="text-[11px] text-slate-400">
                        {product.category?.name}
                    </p>
                    )}

                    {/* Badge */}
                    <div className="flex gap-1 my-2">
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
                    </div>


                    {/* CTA */}
                    <div className="mt-auto flex flex-col gap-2 ">
                        <div className="h-px bg-slate-100 dark:bg-slate-800"></div>
                        {/* PRICE */}
                        {product.show_price ? (

                            <div className="flex items-center justify-between">
                                <div className="flex flex-col">
                                    {product.compare_at_price &&
                                        product.compare_at_price > product.price && (
                                        <span className="text-[10px] text-slate-400 line-through">
                                            {formatPrice(product.compare_at_price)}
                                        </span>
                                    )}
                                    <span className="text-sm font-medium tracking-tight text-slate-900 dark:text-white">
                                        {formatPrice(product.price)}
                                    </span>
                                </div>
                                <span className="text-[10px] text-slate-400 inline-flex text-nowrap items-center gap-1">
                                    <InfoIcon className="h-3 w-3" /> Harga Estimasi
                                </span>
                            </div>

                        ) : (

                            <div className="space-y-3">
                                <div>
                                    <div className="text-xs font-semibold text-slate-900 dark:text-white">
                                        Konsultasikan Harga
                                    </div>

                                    <div className="text-[11px] text-slate-500">
                                        Disesuaikan dengan kebutuhan Anda
                                    </div>
                                </div>
                            </div>

                        )}
                        <div className="h-px bg-slate-100 dark:bg-slate-800"></div>

                        <Link
                            href={`/catalog/${product.slug}`}
                            className="flex items-center justify-center w-full mt-1 text-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-orange-600"
                        >
                            Lihat Detail
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>

                </div>
            </div>
        </Link>
    );
}