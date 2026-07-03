import { createContext, useContext, useState, useEffect } from "react";
import API from "../api/axios";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart]             = useState({ items: [], totalPrice: 0 });
  const [cartLoading, setCartLoading] = useState(false);

  useEffect(() => {
    if (user) {
      // Small delay to ensure token is set in localStorage before fetching
      const timer = setTimeout(() => fetchCart(), 100);
      return () => clearTimeout(timer);
    } else {
      setCart({ items: [], totalPrice: 0 });
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      setCartLoading(true);
      const { data } = await API.get("/cart");
      setCart(data.cart || { items: [], totalPrice: 0 });
    } catch (err) {
      console.error("Cart fetch failed", err);
      setCart({ items: [], totalPrice: 0 });
    } finally {
      setCartLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    const { data } = await API.post("/cart", { productId, quantity });
    setCart(data.cart);
    // Re-fetch to get fully populated product details
    await fetchCart();
    return data;
  };

  const updateQuantity = async (productId, quantity) => {
    const { data } = await API.put(`/cart/${productId}`, { quantity });
    setCart(data.cart);
    await fetchCart();
  };

  const removeFromCart = async (productId) => {
    await API.delete(`/cart/${productId}`);
    await fetchCart();
  };

  const clearCart = async () => {
    await API.delete("/cart");
    setCart({ items: [], totalPrice: 0 });
  };

  const cartCount = cart.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{
      cart, cartLoading, cartCount,
      fetchCart, addToCart, updateQuantity, removeFromCart, clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);