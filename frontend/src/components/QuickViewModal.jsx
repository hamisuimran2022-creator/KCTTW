import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { X, ShoppingBag, Check, MessageCircle, Star } from "lucide-react";

const QuickViewModal = ({ product, onClose }) => {
  if (!product) return null;

  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || "Black");
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "Standard");
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product, selectedColor, selectedSize, quantity);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 1200);
  };

  const handleWhatsAppInquiry = () => {
    const text = `Hello KCTTW 👋 I'm interested in ordering the ${product.name} (Color: ${selectedColor}, Size: ${selectedSize}, Qty: ${quantity}) for ₦${(product.price * quantity).toLocaleString("en-NG")}.`;
    window.open(`https://wa.me/2349072585516?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2000,
        background: "rgba(0, 0, 0, 0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px"
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel"
        style={{
          width: "100%",
          maxWidth: "850px",
          background: "#0d0d0d",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          borderRadius: "28px",
          overflow: "hidden",
          position: "relative",
          boxShadow: "0 30px 100px rgba(0,0,0,0.8)",
          maxHeight: "90vh",
          overflowY: "auto"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            zIndex: 10,
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.1)",
            border: "none",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))"
          }}
        >
          {/* Left: Product Image */}
          <div
            style={{
              padding: "40px",
              background: "radial-gradient(circle at center, rgba(255,255,255,0.06), rgba(0,0,0,0.6))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <img
              src={product.image}
              alt={product.name}
              style={{
                width: "100%",
                maxHeight: "360px",
                objectFit: "contain"
              }}
            />
          </div>

          {/* Right: Details & Controls */}
          <div style={{ padding: "40px 30px", display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontSize: "11px",
                letterSpacing: "2px",
                fontWeight: "800",
                color: "var(--gold)",
                textTransform: "uppercase",
                marginBottom: "6px"
              }}
            >
              {product.categoryName}
            </span>

            <h2 style={{ fontSize: "24px", fontWeight: "900", color: "#ffffff", marginBottom: "12px" }}>
              {product.name}
            </h2>

            {/* Rating */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "16px" }}>
              <div style={{ display: "flex", color: "var(--gold)" }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="var(--gold)" />
                ))}
              </div>
              <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "600" }}>
                ({product.reviewsCount || 48} verified reviews)
              </span>
            </div>

            {/* Price */}
            <div style={{ fontSize: "24px", fontWeight: "900", color: "#ffffff", marginBottom: "16px" }}>
              ₦{(product.price * quantity).toLocaleString("en-NG")}
            </div>

            {/* Description */}
            <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: "1.7", marginBottom: "24px" }}>
              {product.description}
            </p>

            {/* Colors */}
            <div style={{ marginBottom: "20px" }}>
              <div style={{ fontSize: "12px", fontWeight: "700", marginBottom: "10px", color: "#fff" }}>
                Color: <span style={{ color: "var(--gold)" }}>{selectedColor}</span>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      backgroundColor: c.hex,
                      border: selectedColor === c.name ? "2px solid #ffffff" : "1px solid rgba(255,255,255,0.2)",
                      boxShadow: selectedColor === c.name ? "0 0 12px rgba(255,255,255,0.4)" : "none",
                      transform: selectedColor === c.name ? "scale(1.15)" : "scale(1)",
                      transition: "all 0.2s ease"
                    }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div style={{ marginBottom: "24px" }}>
              <div style={{ fontSize: "12px", fontWeight: "700", marginBottom: "10px", color: "#fff" }}>
                Size: <span style={{ color: "var(--gold)" }}>{selectedSize}</span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "10px",
                      background: selectedSize === s ? "#ffffff" : "rgba(255,255,255,0.06)",
                      color: selectedSize === s ? "#000000" : "#ffffff",
                      border: "1px solid rgba(255,255,255,0.15)",
                      fontSize: "12px",
                      fontWeight: "700",
                      transition: "all 0.2s"
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity and Actions */}
            <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "16px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "12px",
                  padding: "4px"
                }}
              >
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{
                    width: "36px",
                    height: "36px",
                    background: "none",
                    border: "none",
                    color: "#fff",
                    fontSize: "16px",
                    fontWeight: "800"
                  }}
                >
                  −
                </button>
                <span style={{ minWidth: "30px", textAlign: "center", fontWeight: "800", fontSize: "14px" }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  style={{
                    width: "36px",
                    height: "36px",
                    background: "none",
                    border: "none",
                    color: "#fff",
                    fontSize: "16px",
                    fontWeight: "800"
                  }}
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                style={{
                  flexGrow: 1,
                  height: "48px",
                  borderRadius: "12px",
                  border: "none",
                  background: isAdded ? "var(--success)" : "#ffffff",
                  color: "#000000",
                  fontSize: "12px",
                  fontWeight: "800",
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  transition: "all 0.2s"
                }}
              >
                {isAdded ? (
                  <>
                    <Check size={16} /> ADDED TO BAG
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} /> ADD TO BAG
                  </>
                )}
              </button>
            </div>

            {/* WhatsApp VIP Button */}
            <button
              onClick={handleWhatsAppInquiry}
              style={{
                width: "100%",
                height: "44px",
                borderRadius: "12px",
                border: "1px solid rgba(46, 213, 115, 0.3)",
                background: "rgba(46, 213, 115, 0.08)",
                color: "#2ed573",
                fontSize: "11px",
                fontWeight: "800",
                letterSpacing: "1px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px"
              }}
            >
              <MessageCircle size={16} /> Order Via WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
