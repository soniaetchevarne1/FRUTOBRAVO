"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '@/lib/types';

interface StoreContextType {
    cart: CartItem[];
    addToCart: (product: Product, quantity: number) => void;
    removeFromCart: (productId: string) => void;
    clearCart: () => void;
    cartCount: number;
    cartTotal: number;
    isWholesale: boolean;
    toggleWholesale: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isWholesale, setIsWholesale] = useState(false);

    // Load cart from localStorage on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedCart = localStorage.getItem('sonia_cart');
            if (savedCart) {
                try {
                    setCart(JSON.parse(savedCart));
                } catch (e) {
                    console.error('Error parsing cart', e);
                }
            }
        }
    }, []);

    // Save cart to localStorage on change
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('sonia_cart', JSON.stringify(cart));
        }
    }, [cart]);

    const addToCart = (product: Product, quantity: number) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.id === product.id);
            if (existing) {
                return prev.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
                );
            }
            return [...prev, { ...product, quantity }];
        });
    };

    const removeFromCart = (productId: string) => {
        setCart((prev) => prev.filter((item) => item.id !== productId));
    };

    const clearCart = () => setCart([]);

    const toggleWholesale = () => setIsWholesale(!isWholesale);

    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    const cartTotal = cart.reduce((acc, item) => {
        const price = isWholesale ? item.priceWholesale : item.priceRetail;
        return acc + price * item.quantity;
    }, 0);

    return (
        <StoreContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                clearCart,
                cartCount,
                cartTotal,
                isWholesale,
                toggleWholesale,
            }}
        >
            {children}
        </StoreContext.Provider>
    );
}

export const useStore = () => {
    const context = useContext(StoreContext);
    if (!context) throw new Error('useStore must be used within a StoreProvider');
    return context;
};
