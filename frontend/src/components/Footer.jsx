import React from "react";
import { Link } from "react-router-dom";
import { MessageCircle, ShieldCheck, Truck, Clock } from "lucide-react";

const Footer = () => {
  return (
    <footer
      style={{
        background: "#050505",
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        paddingTop: "80px",
        paddingBottom: "40px",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Brand Features Strip */}
      <div className="kcttw-container" style={{ marginBottom: "60px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "24px",
            padding: "30px",
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "20px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "rgba(212, 175, 55, 0.1)",
                color: "var(--gold)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <ShieldCheck size={24} />
            </div>
            <div>
              <h5 style={{ fontSize: "14px", fontWeight: "800", margin: 0 }}>Authentic Luxury</h5>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "4px 0 0" }}>
                100% handcrafted streetwear precision
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "rgba(212, 175, 55, 0.1)",
                color: "var(--gold)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Truck size={24} />
            </div>
            <div>
              <h5 style={{ fontSize: "14px", fontWeight: "800", margin: 0 }}>Express Dispatch</h5>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "4px 0 0" }}>
                Fast nationwide and worldwide courier
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "rgba(212, 175, 55, 0.1)",
                color: "var(--gold)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Clock size={24} />
            </div>
            <div>
              <h5 style={{ fontSize: "14px", fontWeight: "800", margin: 0 }}>24/7 VIP Concierge</h5>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "4px 0 0" }}>
                Direct support on WhatsApp anytime
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="kcttw-container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "40px",
            marginBottom: "60px"
          }}
        >
          {/* Brand Info */}
          <div style={{ gridColumn: "span 1" }}>
            <h3 style={{ fontSize: "24px", fontWeight: "900", letterSpacing: "3px", marginBottom: "8px" }}>
              KCTTW
            </h3>
            <p style={{ fontSize: "10px", letterSpacing: "3px", color: "var(--gold)", fontWeight: "800", marginBottom: "16px" }}>
              KAMBA COLLECTION — TO THE WORLD
            </p>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: "1.7", maxWidth: "320px" }}>
              Redefining contemporary streetwear with bold confidence, authentic African craftsmanship, and timeless silhouette elegance.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 style={{ fontSize: "12px", letterSpacing: "2px", fontWeight: "800", color: "#ffffff", marginBottom: "20px", textTransform: "uppercase" }}>
              Quick Links
            </h4>
            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "12px", fontSize: "13px", color: "var(--text-muted)" }}>
              <li><Link to="/" style={{ transition: "color 0.2s" }}>Home</Link></li>
              <li><Link to="/products">All Collection</Link></li>
              <li><Link to="/about">About KCTTW</Link></li>
              <li><Link to="/contact">Contact & Support</Link></li>
              <li><Link to="/dashboard">VIP Account</Link></li>
            </ul>
          </div>

          {/* Collections */}
          <div>
            <h4 style={{ fontSize: "12px", letterSpacing: "2px", fontWeight: "800", color: "#ffffff", marginBottom: "20px", textTransform: "uppercase" }}>
              Collections
            </h4>
            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "12px", fontSize: "13px", color: "var(--text-muted)" }}>
              <li><Link to="/products?category=caps">Signature Caps</Link></li>
              <li><Link to="/products?category=shirts">Collared Shirts</Link></li>
              <li><Link to="/products?category=round-necks">Heavyweight Round Necks</Link></li>
              <li><Link to="/products">Limited Drops</Link></li>
            </ul>
          </div>

          {/* Social & Concierge */}
          <div>
            <h4 style={{ fontSize: "12px", letterSpacing: "2px", fontWeight: "800", color: "#ffffff", marginBottom: "20px", textTransform: "uppercase" }}>
              Connect
            </h4>
            <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
              <a
                href="https://www.instagram.com/kcttw"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "10px",
                  background: "rgba(255, 255, 255, 0.06)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff"
                }}
                aria-label="Instagram"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>

              <a
                href="https://wa.me/2349072585516"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "10px",
                  background: "rgba(46, 213, 115, 0.12)",
                  border: "1px solid rgba(46, 213, 115, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#2ed573"
                }}
                aria-label="WhatsApp Concierge"
              >
                <MessageCircle size={18} />
              </a>
            </div>

            <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
              WhatsApp Concierge: <br />
              <strong style={{ color: "#ffffff" }}>+234 907 258 5516</strong>
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            paddingTop: "30px",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            fontSize: "12px",
            color: "var(--text-dim)"
          }}
        >
          <div>© {new Date().getFullYear()} KCTTW (Kamba Collection). All Rights Reserved.</div>
          <div>Secure Payments with Korapay & Paystack</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
