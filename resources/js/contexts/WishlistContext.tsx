import React, { createContext, useContext, useState, useEffect } from 'react';

export interface WishlistItem {
    id: number;
    name: string;
    price: number;
    image: string;
    slug: string;
}

interface WishlistContextType {
    wishlist: WishlistItem[];
    addToWishlist: (item: Omit<WishlistItem, 'id'> & { id?: number }) => boolean;
    removeFromWishlist: (id: number) => void;
    isInWishlist: (id: number) => boolean;
    toggleWishlistItem: (item: WishlistItem) => boolean;
    wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlistContext = () => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlistContext must be used within a WishlistProvider');
    }
    return context;
};

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);

    // Load wishlist from localStorage on initial render
    useEffect(() => {
        const storedWishlist = localStorage.getItem('wishlist');
        if (storedWishlist) {
            try {
                setWishlist(JSON.parse(storedWishlist));
            } catch (error) {
                console.error('Error parsing wishlist from localStorage:', error);
                setWishlist([]);
            }
        }
        setIsInitialized(true);
    }, []);

    // Save wishlist to localStorage whenever it changes
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
        }
    }, [wishlist, isInitialized]);

    const addToWishlist = (item: Omit<WishlistItem, 'id'> & { id?: number }) => {
        // Ensure we have all required fields
        if (!item.id || !item.name || item.price === undefined || !item.image || !item.slug) {
            console.error('Invalid wishlist item:', item);
            return false;
        }

        setWishlist(prevItems => {
            // Check if item already exists in wishlist
            const exists = prevItems.some(wishlistItem => wishlistItem.id === item.id);
            if (exists) {
                return prevItems;
            }
            return [...prevItems, item as WishlistItem];
        });
        return true;
    };

    const removeFromWishlist = (id: number) => {
        setWishlist(prevItems => prevItems.filter(item => item.id !== id));
    };

    const isInWishlist = (id: number) => {
        return wishlist.some(item => item.id === id);
    };

    const toggleWishlistItem = (item: WishlistItem) => {
        if (isInWishlist(item.id)) {
            removeFromWishlist(item.id);
            return false;
        } else {
            addToWishlist(item);
            return true;
        }
    };

    const value: WishlistContextType = {
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        toggleWishlistItem,
        wishlistCount: wishlist.length
    };

    return (
        <WishlistContext.Provider value={value}>
            {children}
        </WishlistContext.Provider>
    );
};
