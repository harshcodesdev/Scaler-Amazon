"use client";

import React, { createContext, useContext, useEffect, useReducer } from "react";
import { Product } from "@prisma/client";
import { useToast } from "@/context/ToastContext";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: "ADD_ITEM"; payload: { product: Product; quantity: number } }
  | { type: "REMOVE_ITEM"; payload: { id: string } }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartItem[] };

const initialState: CartState = {
  items: [],
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingIndex = state.items.findIndex(
        (item) => item.product.id === action.payload.product.id
      );
      if (existingIndex >= 0) {
        const updatedItems = [...state.items];
        updatedItems[existingIndex].quantity += action.payload.quantity;
        return { ...state, items: updatedItems };
      }
      return { ...state, items: [...state.items, action.payload] };
    }
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.product.id !== action.payload.id),
      };
    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items.map((item) =>
          item.product.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    case "CLEAR_CART":
      return { ...state, items: [] };
    case "LOAD_CART":
      return { ...state, items: action.payload };
    default:
      return state;
  }
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (id: string, title?: string) => void;
  updateQty: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { addToast } = useToast();

  useEffect(() => {
    try {
      const saved = localStorage.getItem("amazon-harshdeep-cart");
      if (saved) {
        dispatch({ type: "LOAD_CART", payload: JSON.parse(saved) });
      }
    } catch (e) {
      console.error("Failed to load cart from localStorage", e);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("amazon-harshdeep-cart", JSON.stringify(state.items));
  }, [state.items]);

  const addToCart = (product: Product, quantity: number) => {
    dispatch({ type: "ADD_ITEM", payload: { product, quantity } });
    addToast(`"${product.title.substring(0, 30)}..." added to cart.`, "SUCCESS");
  };

  const removeFromCart = (id: string, title?: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: { id } });
    addToast(`Item removed from your shopping basket.`, "INFO");
  };

  const updateQty = (id: string, quantity: number) => {
    if (quantity <= 0) return removeFromCart(id);
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const cartTotal = state.items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const itemCount = state.items.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems: state.items,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        cartTotal,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
