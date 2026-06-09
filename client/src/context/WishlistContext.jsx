import { createContext, useContext, useState, useEffect } from "react";
import API from "../api/axios";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  useEffect(() => {
    if (user) fetchWishlist();
    else setWishlist([]);
  }, [user]);

  const fetchWishlist = async () => {
    try {
      setWishlistLoading(true);
      const { data } = await API.get("/wishlist");
      setWishlist(data.products);
    } catch (err) {
      console.error("Wishlist fetch failed", err);
    } finally {
      setWishlistLoading(false);
    }
  };

  const toggleWishlist = async (productId) => {
    try {
      const { data } = await API.post(`/wishlist/${productId}`);
      await fetchWishlist();
      return data.action; // "added" or "removed"
    } catch (err) {
      throw err;
    }
  };

  const isWishlisted = (productId) =>
    wishlist.some(p => p._id === productId || p === productId);

  const clearWishlist = async () => {
    await API.delete("/wishlist");
    setWishlist([]);
  };

  return (
    <WishlistContext.Provider value={{
      wishlist, wishlistLoading,
      toggleWishlist, isWishlisted, clearWishlist, fetchWishlist,
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);