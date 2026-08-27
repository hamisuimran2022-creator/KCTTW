import React, { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { PRODUCTS, CATEGORIES } from "../data/products";
import ProductCard from "../components/ProductCard";
import QuickViewModal from "../components/QuickViewModal";
import { Search, SlidersHorizontal } from "lucide-react";

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [activeModalProduct, setActiveModalProduct] = useState(null);

  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    if (catId === "all") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", catId);
    }
    setSearchParams(searchParams);
  };

  const filteredProducts = useMemo(() => {
    let list = [...PRODUCTS];

    // Filter by Category
    if (selectedCategory !== "all") {
      list = list.filter((p) => p.category === selectedCategory);
    }

    // Filter by Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === "price-low") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [selectedCategory, searchQuery, sortBy]);

  return (
    <div style={{ paddingTop: "120px", paddingBottom: "120px" }}>
      <div className="kcttw-container">
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <span style={{ fontSize: "11px", letterSpacing: "3px", fontWeight: "800", color: "var(--gold)", textTransform: "uppercase" }}>
            THE OFFICIAL ARCHIVE
          </span>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 54px)", fontWeight: "900", letterSpacing: "-1.5px", marginTop: "8px" }}>
            The KCTTW Collection
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", maxWidth: "540px", margin: "14px auto 0" }}>
            Explore limited luxury apparel, precision-cut fabrics, and iconic drops.
          </p>
        </div>

        {/* Controls Bar */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "40px"
          }}
        >
          {/* Category Filter Tabs */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                style={{
                  padding: "10px 20px",
                  borderRadius: "12px",
                  background: selectedCategory === cat.id ? "#ffffff" : "rgba(255, 255, 255, 0.05)",
                  color: selectedCategory === cat.id ? "#000000" : "#ffffff",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  fontSize: "12px",
                  fontWeight: "800",
                  letterSpacing: "1px",
                  transition: "all 0.2s"
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Search & Sort Controls */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", alignItems: "center" }}>
            {/* Search Input */}
            <div style={{ position: "relative", width: "240px" }}>
              <Search
                size={16}
                style={{
                  position: "absolute",
                  left: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-dim)"
                }}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search collection..."
                style={{
                  width: "100%",
                  height: "44px",
                  paddingLeft: "40px",
                  paddingRight: "14px",
                  borderRadius: "12px",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid var(--border-glass)",
                  color: "#ffffff",
                  fontSize: "13px"
                }}
              />
            </div>

            {/* Sort Select */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                height: "44px",
                padding: "0 16px",
                borderRadius: "12px",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid var(--border-glass)",
                color: "#ffffff",
                fontSize: "13px",
                fontWeight: "600"
              }}
            >
              <option value="featured" style={{ background: "#111" }}>Featured Drops</option>
              <option value="price-low" style={{ background: "#111" }}>Price: Low to High</option>
              <option value="price-high" style={{ background: "#111" }}>Price: High to Low</option>
              <option value="rating" style={{ background: "#111" }}>Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Product Count Display */}
        <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "24px" }}>
          Showing <strong>{filteredProducts.length}</strong> apparel items
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "30px"
            }}
          >
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={(p) => setActiveModalProduct(p)}
              />
            ))}
          </div>
        ) : (
          <div
            className="glass-panel"
            style={{
              padding: "60px 20px",
              textAlign: "center",
              margin: "40px 0"
            }}
          >
            <h3 style={{ fontSize: "20px", fontWeight: "800", marginBottom: "10px" }}>
              No Drops Found
            </h3>
            <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "24px" }}>
              Try adjusting your search terms or category filter.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSearchQuery("");
              }}
              className="btn-outline-kcttw"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={activeModalProduct}
        onClose={() => setActiveModalProduct(null)}
      />
    </div>
  );
};

export default ProductsPage;
