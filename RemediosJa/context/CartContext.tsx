import React, { createContext, useState, useContext, ReactNode, useMemo } from 'react';

export interface CartItem {
  id: number;
  name: string;
  pharmacy: string;
  pharmacy_id?: number;
  price: number;
  quantity: number;
}

interface CartContextData {
  cart: CartItem[];
  cartTotal: number;
  addItem: (product: { id: number; name: string; pharmacy: string; price: number; pharmacy_id?: number }) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, delta: 1 | -1) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const deliveryFee = 5.00;

  const addItem = (product: { id: number; name: string; pharmacy: string; price: number; pharmacy_id?: number }) => {
    setCart(currentCart => {
      const existingItem = currentCart.find(item => item.id === product.id);

      if (existingItem) {
        return currentCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...currentCart, { ...product, quantity: 1, pharmacy_id: product.pharmacy_id }];
      }
    });
  };

  const removeItem = (id: number) => {
    setCart(currentCart => currentCart.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, delta: 1 | -1) => {
    setCart(currentCart => {
      const updatedCart = currentCart.map(item =>
        item.id === id ? { ...item, quantity: item.quantity + delta } : item
      ).filter(item => item.quantity > 0);
      
      return updatedCart;
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartTotal = cartSubtotal > 0 ? cartSubtotal + deliveryFee : 0;

  const contextValue = useMemo(() => ({
    cart,
    cartTotal,
    addItem,
    removeItem,
    updateQuantity,
    clearCart
  }), [cart, cartTotal]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};