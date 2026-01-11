"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// --- DEFINICE TYPŮ ---
interface Flower {
    id: string;
    name: string;
    price: number;
    stock: number; // Nově nutné pro kontrolu skladu
    img?: string;
    imageUrl?: string;
    subtitle?: string;
}

interface CartItem extends Flower {
    quantity: number;
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (product: Flower) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, amount: number) => void;
    clearCart: () => void;
    cartTotal: number;
    cartCount: number;
    isCartOpen: boolean;
    setIsCartOpen: (isOpen: boolean) => void;
    // NOVÉ: Přidáváme stav vzkazu
    orderNote: string;
    setOrderNote: (note: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [orderNote, setOrderNote] = useState(''); // PŘIDÁNO


    // Načtení košíku a vzkazu z LocalStorage
    useEffect(() => {
        if (typeof window !== "undefined") {
            const savedCart = localStorage.getItem("flowerShopCart");
            if (savedCart) {
                try {
                    setCartItems(JSON.parse(savedCart));
                } catch (error) {
                    console.error("Chyba při načítání košíku:", error);
                }
            }

            const savedNote = localStorage.getItem("flowerShopOrderNote");
            if (savedNote) {
                setOrderNote(savedNote);
            }
        }
    }, []);

    // Uložení košíku do LocalStorage
    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("flowerShopCart", JSON.stringify(cartItems));
        }
    }, [cartItems]);

    // Uložení vzkazu do LocalStorage
    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("flowerShopOrderNote", orderNote);
        }
    }, [orderNote]);

    // Přidat do košíku
    const addToCart = (product: Flower) => {
        setCartItems((prev) => {
            const existingItem = prev.find((item) => item.id === product.id);

            if (existingItem) {
                if (existingItem.quantity >= existingItem.stock) {
                    return prev;
                }

                return prev.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }

            if (product.stock === 0) {
                return prev;
            }

            return [...prev, { ...product, quantity: 1, stock: product.stock }];
        });
        setIsCartOpen(true);
    };

    // Odebrat z košíku úplně
    const removeFromCart = (id: string) => {
        setCartItems((prev) => prev.filter((item) => item.id !== id));
    };

    // Změnit množství (+/-)
    const updateQuantity = (id: string, amount: number) => {
        setCartItems((prev) =>
            prev.map((item) => {
                if (item.id === id) {
                    const newQuantity = item.quantity + amount;

                    if (amount > 0 && newQuantity > item.stock) {
                        return item; // Blokuje navýšení
                    }

                    return { ...item, quantity: newQuantity > 0 ? newQuantity : 1 };
                }
                return item;
            })
        );
    };

    // Vyčistit košík (např. po nákupu)
    const clearCart = () => {
        setCartItems([]);
        setOrderNote('');
        if (typeof window !== "undefined") {
            localStorage.removeItem("flowerShopOrderNote");
        }
    };

    // Výpočty
    const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                cartTotal,
                cartCount,
                isCartOpen,
                setIsCartOpen,
                orderNote,
                setOrderNote,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart musí být použit uvnitř CartProvider");
    }
    return context;
};