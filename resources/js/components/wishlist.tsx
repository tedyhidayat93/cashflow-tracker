import { X, Heart, Trash } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { useEffect, useRef, useState, useCallback } from 'react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import product from '@/routes/cms/product';

interface WishlistItem {
    id: number;
    name: string;
    price: number;
    image: string;
    slug: string;
}

interface WishlistProps {
    isOpen: boolean;
    onClose: () => void;
    items: WishlistItem[];
    onRemove: (id: number) => void;
}

export default function Wishlist({ isOpen, onClose, items, onRemove }: WishlistProps) {
    const wishlistRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [localItems, setLocalItems] = useState<WishlistItem[]>(items);

    // Close wishlist when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wishlistRef.current && !wishlistRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'auto';
        };
    }, [isOpen, onClose]);

    // Sync local items when items prop changes
    useEffect(() => {
        setLocalItems(items);
    }, [items]);

    // Handle animation states
    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            // Small delay to ensure the element is rendered before starting the animation
            const timer = setTimeout(() => {
                setIsAnimating(true);
            }, 10);
            return () => clearTimeout(timer);
        } else {
            setIsAnimating(false);
            // Wait for the animation to complete before hiding the component
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    // Memoize the remove handler to prevent unnecessary re-renders
    const handleRemove = useCallback((id: number) => {
        onRemove(id);
        // Optimistically update the local state
        setLocalItems(prevItems => prevItems.filter(item => item.id !== id));
        
        toast.success("Berhasil menghapus dari wishlist.");
    }, [onRemove]);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-60 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-black/45 backdrop-blur-sm bg-opacity-75 transition-opacity" aria-hidden="true" />
                <div className="fixed inset-0 overflow-hidden z-60">
                    <div className="absolute inset-0 overflow-hidden">
                        <div 
                            className="absolute inset-0 bg-opacity-75 transition-opacity"
                            onClick={onClose}
                            aria-hidden="true"
                        />
                        <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
                            <div 
                                ref={wishlistRef}
                                className="w-screen max-w-md transform transition-all duration-300 ease-in-out"
                                style={{
                                    transform: isAnimating ? 'translateX(0)' : 'translateX(100%)',
                                    opacity: isAnimating ? 1 : 0,
                                    transition: 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out'
                                }}
                            >
                                <div className="flex h-full flex-col bg-white dark:bg-gray-800 shadow-xl">
                                    <div className="flex items-center justify-between border-b border-gray-200 px-4 py-6 sm:px-6">
                                        <h2 className="text-lg font-medium text-gray-900 dark:text-orange-500">Daftar Favorit</h2>
                                        <button
                                            type="button"
                                            className="rounded-md bg-white dark:bg-slate-800 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                                            onClick={onClose}
                                        >
                                            <span className="sr-only">Tutup</span>
                                            <X className="h-6 w-6" aria-hidden="true" />
                                        </button>
                                    </div>

                                    <div className="flex-1 overflow-y-auto py-2 px-2 sm:px-6">
                                        {localItems.length === 0 ? (
                                            <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                                                <Heart className="mx-auto h-12 w-12 text-gray-400" />
                                                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-orange-400">Daftar favorit kosong</h3>
                                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-300">Mulai dengan menambahkan beberapa produk favorit Anda.</p>
                                            </div>
                                        ) : (
                                            <ul className="divide-y divide-gray-200">
                                                {localItems.map((item) => (
                                                    <li key={item.id} className="flex py-6">
                                                        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md border border-gray-200">
                                                            <img
                                                                src={item.image}
                                                                alt={item.name}
                                                                className="h-full w-full object-cover object-center"
                                                            />
                                                        </div>

                                                        <div className="ml-4 flex flex-1 justify-between">
                                                            <div className="flex justify-center flex-col items-start">
                                                                <h3 className="text-sm md:text-base font-semibold text-gray-900 dark:text-white line-clamp-2">
                                                                    <Link 
                                                                        href={`/catalog/${item.slug}`}
                                                                        className="hover:text-primary"
                                                                        onClick={onClose}
                                                                    >
                                                                        {item.name}
                                                                    </Link>
                                                                </h3>
                                                                <Link
                                                                    href={`/catalog/${item.slug}`}
                                                                    className="mt-1 text-sm text-gray-500 dark:text-gray-300 hover:text-primary"
                                                                    onClick={onClose}
                                                                >
                                                                    Lihat Detail
                                                                </Link>
                                                            </div>
                                                            <div className="mt-2 flex items-center justify-between">
                                                                 <Button
                                                                    className='cursor-pointer'
                                                                    variant="destructive"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleRemove(item.id);
                                                                    }}
                                                                    title="Hapus dari favorit"
                                                                >
                                                                    <Trash className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>

                                    <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                                        <div className="mt-6">
                                            <Link
                                                href="/catalog"
                                                className="flex items-center justify-center rounded-md border border-transparent bg-primary px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-primary/90"
                                                onClick={onClose}
                                            >
                                                Lihat Katalog
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
