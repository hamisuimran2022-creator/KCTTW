import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Trash2, Plus, Minus, ArrowRight, MessageCircle, ShoppingBag } from "lucide-react";

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, cartTotal, cartCount } = useCart();
  const navigate = useNavigate();

  const handleWhatsAppCheckout = () => {
    if (cart.length === 0) return;
    const itemsList = cart
      .map((item) => `- ${item.name} (${item.color}, ${item.size}) x${item.quantity} = ₦${(item.price * item.quantity).toLocaleString("en-NG")}`)
      .join("\n");
    const msg = `Hello KCTTW 👋 I would like to place an order for the following items:\n\n${itemsList}\n\n*Total: ₦${cartTotal.toLocaleString("en-NG")}*\n\nPlease confirm availability and payment details.`;
    window.open(`https://wa.me/2349072585516?text=${encodeURIComponent(msg)}`, "_blank");
  };

  if (cart.length === 0) {
    return (
      <div style={{ paddingTop: "140px", paddingBottom: "140px" }}>
        <div className="kcttw-container">
          <div
            className="glass-panel"
            style={{
              padding: "80px 30px",
              textAlign: "center",
              maxWidth: "600px",
              margin: "0 auto"
            }}
          >
            <div
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.05)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
                color: "var(--gold)"
              }}
            >
              <ShoppingBag size={32} />
            </div>

            <h2 style={{ fontSize: "28px", fontWeight: "900", marginBottom: "12px" }}>
              Your Bag is Empty
            </h2>
            <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: "1.7", marginBottom: "30px" }}>
              Looks like you haven't added any luxury pieces yet. Explore our latest drops and elevate your style.
            </p>

            <Link to="/products" className="btn-gold-kcttw">
              <span>EXPLORE COLLECTION</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: "120px", paddingBottom: "120px" }}>
      <div className="kcttw-container">
        {/* Header */}
        <div style={{ marginBottom: "40px" }}>
          <span style={{ fontSize: "11px", letterSpacing: "3px", fontWeight: "800", color: "var(--gold)", textTransform: "uppercase" }}>
            SHOPPING BAG
          </span>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: "900", letterSpacing: "-1px", marginTop: "6px" }}>
            Review Your Items ({cartCount})
          </h1>
        </div>

        {/* Layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "40px",
            alignItems: "flex-start"
          }}
        >
          {/* Left: Cart Items List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", gridColumn: "span 2" }}>
            {cart.map((item) => (
              <div
                key={item.cartItemId}
                className="glass-panel"
                style={{
                  padding: "20px",
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "20px"
                }}
              >
                {/* Product Thumbnail & Details */}
                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                  <div
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "14px",
                      background: "rgba(255, 255, 255, 0.05)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "8px",
                      flexShrink: 0
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: "100%", height: "100%", objectFit: "contain" }}
                    />
                  </div>

                  <div>
                    <h3 style={{ fontSize: "15px", fontWeight: "800", color: "#ffffff", margin: "0 0 6px" }}>
                      {item.name}
                    </h3>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)", display: "flex", gap: "12px" }}>
                      <span>Color: <strong style={{ color: "#ffffff" }}>{item.color}</strong></span>
                      <span>•</span>
                      <span>Size: <strong style={{ color: "#ffffff" }}>{item.size}</strong></span>
                    </div>
                    <div style={{ fontSize: "14px", fontWeight: "800", color: "var(--gold)", marginTop: "6px" }}>
                      ₦{Number(item.price).toLocaleString("en-NG")}
                    </div>
                  </div>
                </div>

                {/* Quantity Controls & Total */}
                <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                  {/* Quantity */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      background: "rgba(255, 255, 255, 0.06)",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      borderRadius: "10px",
                      padding: "2px"
                    }}
                  >
                    <button
                      onClick={() => updateQuantity(item.cartItemId, -1)}
                      style={{
                        width: "32px",
                        height: "32px",
                        background: "none",
                        border: "none",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                      aria-label="Decrease quantity"
                    >
                      <Minus size={14} />
                    </button>
                    <span style={{ minWidth: "28px", textAlign: "center", fontWeight: "800", fontSize: "13px" }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.cartItemId, 1)}
                      style={{
                        width: "32px",
                        height: "32px",
                        background: "none",
                        border: "none",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                      aria-label="Increase quantity"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div style={{ minWidth: "90px", textAlign: "right", fontSize: "16px", fontWeight: "900" }}>
                    ₦{(item.price * item.quantity).toLocaleString("en-NG")}
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => removeFromCart(item.cartItemId)}
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "8px",
                      background: "rgba(255, 71, 87, 0.1)",
                      border: "1px solid rgba(255, 71, 87, 0.2)",
                      color: "var(--danger)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                    aria-label="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}

            {/* Clear Cart Button */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
              <button
                onClick={clearCart}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--text-dim)",
                  fontSize: "12px",
                  fontWeight: "700",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                <Trash2 size={14} /> Clear entire bag
              </button>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="glass-panel" style={{ padding: "30px", position: "sticky", top: "110px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "900", marginBottom: "20px" }}>
              Order Summary
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "var(--text-muted)" }}>
                <span>Subtotal ({cartCount} items)</span>
                <strong style={{ color: "#ffffff" }}>₦{cartTotal.toLocaleString("en-NG")}</strong>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "var(--text-muted)" }}>
                <span>Estimated Shipping</span>
                <span style={{ color: "var(--gold-light)", fontWeight: "700" }}>Calculated at Checkout</span>
              </div>

              <div
                style={{
                  borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                  paddingTop: "16px",
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "18px",
                  fontWeight: "900"
                }}
              >
                <span>Total</span>
                <span style={{ color: "var(--gold)" }}>₦{cartTotal.toLocaleString("en-NG")}</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <button
              onClick={() => navigate("/checkout")}
              className="btn-gold-kcttw"
              style={{ width: "100%", height: "52px", marginBottom: "14px" }}
            >
              <span>PROCEED TO CHECKOUT</span>
              <ArrowRight size={16} />
            </button>

            {/* WhatsApp Direct Order Button */}
            <button
              onClick={handleWhatsAppCheckout}
              style={{
                width: "100%",
                height: "48px",
                borderRadius: "12px",
                border: "1px solid rgba(46, 213, 115, 0.3)",
                background: "rgba(46, 213, 115, 0.08)",
                color: "#2ed573",
                fontSize: "12px",
                fontWeight: "800",
                letterSpacing: "1px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px"
              }}
            >
              <MessageCircle size={16} /> Order Via WhatsApp Concierge
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
