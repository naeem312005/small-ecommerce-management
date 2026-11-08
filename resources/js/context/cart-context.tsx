import React, { createContext, useContext, useEffect, useState } from 'react';

export type CartItem = {
    id: number; // shop_product_id
    shopId: number;
    shopName: string;
    shopSlug: string;
    title: string;
    price: number;
    thumbnail?: string | null;
    quantity: number;
    stock: number;
};

type CartContextType = {
    items: CartItem[];
    addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
    removeItem: (id: number) => void;
    updateQuantity: (id: number, quantity: number) => void;
    clearCart: () => void;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    totalCount: number;
    subtotal: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = 'velora_marketplace_cart_v1';

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>(() => {
        if (typeof window === 'undefined') return [];
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        } catch (e) {
            console.error('Failed to save cart to localStorage', e);
        }
    }, [items]);

    const addItem = (newItem: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
        const qtyToAdd = newItem.quantity || 1;
        setItems((prev) => {
            const existingIndex = prev.findIndex((i) => i.id === newItem.id);
            if (existingIndex > -1) {
                const updated = [...prev];
                const current = updated[existingIndex];
                const newQty = Math.min(current.quantity + qtyToAdd, current.stock || 99);
                updated[existingIndex] = { ...current, quantity: newQty };
                return updated;
            } else {
                return [
                    ...prev,
                    {
                        ...newItem,
                        quantity: Math.min(qtyToAdd, newItem.stock || 99),
                    },
                ];
            }
        });
        setIsOpen(true);
    };

    const removeItem = (id: number) => {
        setItems((prev) => prev.filter((i) => i.id !== id));
    };

    const updateQuantity = (id: number, quantity: number) => {
        if (quantity <= 0) {
            removeItem(id);
            return;
        }
        setItems((prev) =>
            prev.map((i) => {
                if (i.id === id) {
                    const validQty = Math.min(quantity, i.stock || 99);
                    return { ...i, quantity: validQty };
                }
                return i;
            })
        );
    };

    const clearCart = () => {
        setItems([]);
    };

    const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                items,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                isOpen,
                setIsOpen,
                totalCount,
                subtotal,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
