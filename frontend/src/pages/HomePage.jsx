import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PRODUCTS as DEFAULT_PRODUCTS } from "../data/products";
import { productApi } from "../services/api";
import ProductCard from "../components/ProductCard";
import QuickViewModal from "../components/QuickViewModal";
import { ArrowRight, Sparkles, ShieldCheck, Flame, MessageCircle, Star } from "lucide-react";

const HomePage = () => {
  const [activeModalProduct, setActiveModalProduct] = useState(null);
  const [featuredProducts, setFeaturedProducts] = useState(
    DEFAULT_PRODUCTS.filter((p) => p.isFeatured)
  );

  useEffect(() => {
    productApi.getAllProducts()
      .then((res) => {
        if (res.success && res.data?.products && res.data.products.length > 0) {
          const featured = res.data.products.filter((p) => p.isFeatured);
          setFeaturedProducts(featured.length > 0 ? featured : res.data.products.slice(0, 3));
        }
      })
      .catch(() => {
        // Fallback silently
      });
  }, []);

  return (
    <div style={{ paddingTop: "86px" }}>
      {/* =====================================================
          HERO SECTION
      ===================================================== */}
      <section
        style={{
          minHeight: "90vh",
          display: "flex",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
          padding: "80px 0"
        }}
      >
        {/* Glow Spheres */}
        <div
          style={{
            position: "absolute",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(212, 175, 55, 0.08) 0%, transparent 70%)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none"
          }}
        />

        <div className="kcttw-container" style={{ position: "relative", zIndex: 2 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "60px",
              alignItems: "center"
            }}
          >
            {/* Hero Text */}
            <div>
              <div className="badge-gold" style={{ marginBottom: "24px" }}>
                <Sparkles size={14} /> NEW SEASON STREETWEAR
              </div>

              <h1
                style={{
                  fontSize: "clamp(38px, 6vw, 76px)",
                  fontWeight: "900",
                  lineHeight: "1.02",
                  letterSpacing: "-2px",
                  marginBottom: "24px",
                  textTransform: "uppercase"
                }}
              >
                Kamba <br />
                <span
                  style={{
                    background: "linear-gradient(135deg, #ffffff 40%, var(--gold) 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent"
                  }}
                >
                  Collection
                </span>{" "}
                <br />
                To The World
              </h1>

              <p
                style={{
                  fontSize: "16px",
                  color: "var(--text-muted)",
                  lineHeight: "1.8",
                  maxWidth: "500px",
                  marginBottom: "36px"
                }}
              >
                Engineered for kings and trendsetters. Discover our premium handcrafted caps, heavyweight tees, and luxury collared shirts tailored for ultimate confidence.
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
                <Link to="/products" className="btn-gold-kcttw">
                  <span>EXPLORE COLLECTION</span>
                  <ArrowRight size={16} />
                </Link>

                <a
                  href="https://wa.me/2349072585516?text=Hello%20KCTTW%2C%20I%20want%20to%20place%20a%20direct%20order"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline-kcttw"
                >
                  <MessageCircle size={16} color="#2ed573" />
                  <span>VIP CONCIERGE</span>
                </a>
              </div>
            </div>

            {/* Hero Visual Mockup */}
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  maxWidth: "500px",
                  padding: "40px",
                  background: "radial-gradient(circle at center, rgba(255,255,255,0.08), rgba(0,0,0,0.6))",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  borderRadius: "32px",
                  backdropFilter: "blur(20px)",
                  boxShadow: "0 40px 100px rgba(0,0,0,0.6)"
                }}
              >
                <img
                  src="/images/cap.png"
                  alt="KCTTW Signature Drop"
                  style={{
                    width: "100%",
                    height: "auto",
                    objectFit: "contain",
                    filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.8))",
                    transform: "rotate(-4deg) scale(1.05)",
                    transition: "transform 0.5s ease"
                  }}
                  className="hero-img-hover"
                />

                <div
                  style={{
                    position: "absolute",
                    bottom: "25px",
                    left: "25px",
                    right: "25px",
                    padding: "16px 20px",
                    background: "rgba(10, 10, 10, 0.85)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: "16px",
                    backdropFilter: "blur(10px)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <div>
                    <span style={{ fontSize: "10px", color: "var(--gold)", fontWeight: "800", letterSpacing: "1px" }}>
                      FEATURED DROP
                    </span>
                    <h4 style={{ fontSize: "14px", fontWeight: "800", margin: "2px 0 0" }}>
                      Signature Luxe Cap
                    </h4>
                  </div>
                  <span style={{ fontSize: "16px", fontWeight: "900", color: "#ffffff" }}>
                    ₦15,000
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FEATURED PRODUCTS
      ===================================================== */}
      <section style={{ padding: "100px 0", position: "relative" }}>
        <div className="kcttw-container">
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: "50px",
              gap: "20px"
            }}
          >
            <div>
              <span style={{ fontSize: "11px", letterSpacing: "3px", fontWeight: "800", color: "var(--gold)", textTransform: "uppercase" }}>
                CURATED APPAREL
              </span>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: "900", letterSpacing: "-1px", margin: "8px 0 0" }}>
                Signature Drops
              </h2>
            </div>

            <Link
              to="/products"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "12px",
                fontWeight: "800",
                letterSpacing: "1.5px",
                color: "#ffffff"
              }}
            >
              VIEW ALL DROPS <ArrowRight size={15} />
            </Link>
          </div>

          {/* Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "30px"
            }}
          >
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={(p) => setActiveModalProduct(p)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          BRAND STATEMENT
      ===================================================== */}
      <section style={{ padding: "80px 0" }}>
        <div className="kcttw-container">
          <div
            className="glass-panel"
            style={{
              padding: "60px 40px",
              background: "linear-gradient(135deg, rgba(212,175,55,0.06), rgba(255,255,255,0.02))",
              textAlign: "center",
              position: "relative",
              overflow: "hidden"
            }}
          >
            <div className="badge-gold" style={{ marginBottom: "20px" }}>
              <Flame size={14} /> CRAFTED WITH PASSION
            </div>
            <h2
              style={{
                fontSize: "clamp(26px, 4vw, 42px)",
                fontWeight: "900",
                maxWidth: "750px",
                margin: "0 auto 20px",
                lineHeight: "1.2"
              }}
            >
              "Confidence isn't just worn — it is built with every thread."
            </h2>
            <p
              style={{
                fontSize: "14px",
                color: "var(--text-muted)",
                maxWidth: "580px",
                margin: "0 auto 35px",
                lineHeight: "1.8"
              }}
            >
              KCTTW represents a global statement: taking authentic African streetwear innovation and delivering unmatched luxury quality to the world.
            </p>

            <Link to="/about" className="btn-primary-kcttw">
              OUR STORY & HERITAGE
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================
          VIP TESTIMONIALS
      ===================================================== */}
      <section style={{ padding: "80px 0 120px" }}>
        <div className="kcttw-container">
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <span style={{ fontSize: "11px", letterSpacing: "3px", fontWeight: "800", color: "var(--gold)", textTransform: "uppercase" }}>
              COMMUNITY
            </span>
            <h2 style={{ fontSize: "32px", fontWeight: "900", marginTop: "8px" }}>
              What Our Tribe Says
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "24px"
            }}
          >
            {[
              {
                name: "Chukwudi E.",
                city: "Lagos, Nigeria",
                text: "The fabric quality of the collared shirt blew my mind. Heavyweight, breathable, and fits like custom tailoring. KCTTW is top tier.",
                product: "Executive Collared Shirt"
              },
              {
                name: "Fatima A.",
                city: "Abuja, Nigeria",
                text: "Ordered the signature black cap and received it in 24 hours. The embroidery and buckle detail are simply unmatched.",
                product: "Signature Luxe Cap"
              },
              {
                name: "Tunde O.",
                city: "London, UK",
                text: "The boxy round neck is easily the best heavyweight tee in my wardrobe. Premium feel, wash after wash.",
                product: "Heavyweight Round Neck Tee"
              }
            ].map((review, idx) => (
              <div key={idx} className="glass-panel" style={{ padding: "30px" }}>
                <div style={{ display: "flex", color: "var(--gold)", marginBottom: "14px" }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} fill="var(--gold)" />
                  ))}
                </div>
                <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: "1.7", marginBottom: "20px" }}>
                  "{review.text}"
                </p>
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "14px" }}>
                  <strong style={{ display: "block", fontSize: "14px", color: "#fff" }}>{review.name}</strong>
                  <span style={{ fontSize: "11px", color: "var(--text-dim)" }}>
                    {review.city} • Verified Buyer
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      <QuickViewModal
        product={activeModalProduct}
        onClose={() => setActiveModalProduct(null)}
      />
    </div>
  );
};

export default HomePage;
