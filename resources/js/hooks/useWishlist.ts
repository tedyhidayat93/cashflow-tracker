import { useWishlistContext } from '@/contexts/WishlistContext';
import type { WishlistItem } from '@/contexts/WishlistContext';

export type { WishlistItem } from '@/contexts/WishlistContext';

export const useWishlist = () => {
    return useWishlistContext();
};
