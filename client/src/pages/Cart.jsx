import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "../context/CartContext";
import Loader from "../components/Loader";
import toast from "react-hot-toast";

const Cart = () => {
  const { cart, cartLoading, updateQuantity, removeFromCart, clearCart, fetchCart } = useCart();
  const navigate = useNavigate();

  // Always fetch fresh cart data when this page is opened
  useEffect(() => {
    fetchCart();
  }, []);

  if (cartLoading) return <Loader />;

  const shippingPrice = cart.totalPrice > 500 ? 0 : 50;
  const grandTotal    = cart.totalPrice + shippingPrice;

  // Filter out any cart items where product failed to populate (deleted/invalid product)
  const validItems = (cart.items || []).filter(item => item.product && item.product._id);

  const handleRemove = async (productId, name) => {
    try {
      await removeFromCart(productId);
      toast.success(`${name || "Item"} removed`);
    } catch { toast.error("Failed to remove item"); }
  };

  const handleQty = async (productId, qty) => {
    try { await updateQuantity(productId, qty); }
    catch { toast.error("Failed to update quantity"); }
  };

  if (validItems.length === 0) {
    return (
      <div className="container">
        <div className="empty-state" style={{ minHeight: "60vh" }}>
          <ShoppingBag size={64} />
          <h3>Your cart is empty</h3>
          <p>Looks like you haven't added anything yet.</p>
          <Link to="/products" className="btn btn-primary">Start Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page container">
      <div className="page-header">
        <h1 className="page-title">Your <span>Cart</span></h1>
        <p className="page-subtitle">{validItems.length} item{validItems.length !== 1 ? "s" : ""}</p>
      </div>

      <div className="cart-layout">
        <div className="cart-items">
          <div className="cart-items-header">
            <span>Product</span>
            <span>Qty</span>
            <span>Price</span>
            <span></span>
          </div>

          {validItems.map((item) => {
            const product = item.product;
            const name     = product?.name || "Unnamed Product";
            const category = product?.category || "";
            const stock    = product?.stock ?? 99;
            const thumb    = product?.thumbnail || `https://placehold.co/80x80/1a1a2e/e94560?text=${encodeURIComponent(name)}`;

            return (
              <div key={product._id} className="cart-item">
                <div className="cart-item-info">
                  <img src={thumb} alt={name} />
                  <div>
                    <Link to={`/products/${product._id}`} className="cart-item-name">
                      {name}
                    </Link>
                    {category && <p className="cart-item-category">{category}</p>}
                    <p className="cart-item-unit-price">₹{item.price} each</p>
                  </div>
                </div>

                <div className="qty-control cart-qty">
                  <button onClick={() => handleQty(product._id, item.quantity - 1)}
                    disabled={item.quantity <= 1}>
                    <Minus size={13} />
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => handleQty(product._id, item.quantity + 1)}
                    disabled={item.quantity >= stock}>
                    <Plus size={13} />
                  </button>
                </div>

                <p className="cart-item-total">₹{(item.price * item.quantity).toLocaleString()}</p>

                <button className="cart-remove-btn"
                  onClick={() => handleRemove(product._id, name)}>
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })}

          <button className="clear-cart-btn" onClick={() => { clearCart(); toast.success("Cart cleared"); }}>
            <Trash2 size={14} /> Clear cart
          </button>
        </div>

        <div className="cart-summary">
          <h3 className="summary-title">Order Summary</h3>

          <div className="summary-rows">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{cart.totalPrice?.toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span className={shippingPrice === 0 ? "free-shipping" : ""}>
                {shippingPrice === 0 ? "FREE" : `₹${shippingPrice}`}
              </span>
            </div>
            {shippingPrice > 0 && (
              <p className="shipping-hint">Add ₹{500 - cart.totalPrice} more for free shipping</p>
            )}
          </div>

          <hr className="divider" />

          <div className="summary-total">
            <span>Total</span>
            <span>₹{grandTotal.toLocaleString()}</span>
          </div>

          <button
            className="btn btn-primary btn-full"
            onClick={() => navigate("/checkout")}
          >
            Proceed to Checkout <ArrowRight size={16} />
          </button>

          <Link to="/products" className="btn btn-outline btn-full" style={{ marginTop: 10 }}>
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;