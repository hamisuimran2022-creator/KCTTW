import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { Eye, ShoppingBag, Check } from "lucide-react";

const ProductCard = ({ product, onQuickView }) => {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || "Black");
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "Standard");
  const [isAdded, setIsAdded] = useState(false);

  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product, selectedColor, selectedSize, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <div
      className="glass-panel glass-panel-hover"
      style={{
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
        borderRadius: "22px"
      }}
    >
      {/* Product Image Stage */}
      <div
        style={{
          position: "relative",
          width: "100%",
          paddingTop: "105%",
          background: "radial-gradient(circle at center, rgba(255,255,255,0.06), rgba(0,0,0,0.4))",
          overflow: "hidden"
        }}
      >
        {/* Tag Badge */}
        {product.tag && (
          <span
            style={{
              position: "absolute",
              top: "14px",
              left: "14px",
              zIndex: 5,
              background: "rgba(0, 0, 0, 0.75)",
              border: "1px solid rgba(212, 175, 55, 0.4)",
              color: "var(--gold-light)",
              fontSize: "9px",
              fontWeight: "900",
              letterSpacing: "1.5px",
              padding: "5px 10px",
              borderRadius: "8px",
              backdropFilter: "blur(8px)"
            }}
          >
            {product.tag}
          </span>
        )}

        {/* Quick View Button */}
        <button
          onClick={() => onQuickView && onQuickView(product)}
          style={{
            position: "absolute",
            top: "14px",
            right: "14px",
            zIndex: 5,
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: "rgba(0, 0, 0, 0.6)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(10px)",
            transition: "all 0.2s"
          }}
          aria-label="Quick View"
        >
          <Eye size={16} />
        </button>

        {/* Product Image */}
        <img
          src={product.image}
          alt={product.name}
          style={{
            position: "absolute",
            top: "10%",
            left: "10%",
            width: "80%",
            height: "80%",
            objectFit: "contain",
            transition: "transform 0.5s ease"
          }}
          className="product-card-img"
        />
      </div>

      {/* Product Details */}
      <div style={{ padding: "22px", display: "flex", flexDirection: "column", flexGrow: 1 }}>
        <span
          style={{
            fontSize: "10px",
            letterSpacing: "2px",
            textTransform: "uppercase",
            fontWeight: "800",
            color: "var(--gold)",
            marginBottom: "6px"
          }}
        >
          {product.categoryName}
        </span>

        <h4
          style={{
            fontSize: "16px",
            fontWeight: "800",
            letterSpacing: "-0.3px",
            marginBottom: "10px",
            color: "#ffffff"
          }}
        >
          {product.name}
        </h4>

        {/* Price Row */}
        <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "16px" }}>
          <span style={{ fontSize: "18px", fontWeight: "900", color: "#ffffff" }}>
            ₦{product.price.toLocaleString("en-NG")}
          </span>
          {product.originalPrice && (
            <span
              style={{
                fontSize: "13px",
                color: "var(--text-dim)",
                textDecoration: "line-through"
              }}
            >
              ₦{product.originalPrice.toLocaleString("en-NG")}
            </span>
          )}
        </div>

        {/* Color Swatch Circles */}
        <div style={{ marginBottom: "18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "11px" }}>
            <span style={{ color: "var(--text-muted)", fontWeight: "600" }}>Color:</span>
            <strong style={{ color: "#ffffff" }}>{selectedColor}</strong>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            {product.colors.map((c) => (
              <button
                key={c.name}
                onClick={() => setSelectedColor(c.name)}
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  backgroundColor: c.hex,
                  border: selectedColor === c.name ? "2px solid #ffffff" : "1px solid rgba(255,255,255,0.2)",
                  boxShadow: selectedColor === c.name ? "0 0 10px rgba(255,255,255,0.4)" : "none",
                  transform: selectedColor === c.name ? "scale(1.15)" : "scale(1)",
                  transition: "all 0.2s ease"
                }}
                title={c.name}
                aria-label={`Select ${c.name} color`}
              />
            ))}
          </div>
        </div>

        {/* Add to Bag Button */}
        <div style={{ marginTop: "auto" }}>
          <button
            onClick={handleAddToCart}
            style={{
              width: "100%",
              height: "46px",
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
              transition: "all 0.2s ease"
            }}
          >
            {isAdded ? (
              <>
                <Check size={16} /> ADDED TO BAG
              </>
            ) : (
              <>
                <ShoppingBag size={15} /> ADD TO BAG
              </>
            )}
          </button>
        </div>
      </div>

      <style>{`
        .glass-panel-hover:hover .product-card-img {
          transform: scale(1.08);
        }
      `}</style>
    </div>
  );
};

export default ProductCard;
