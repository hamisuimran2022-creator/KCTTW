import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, Shield, Globe, Award, ArrowRight } from "lucide-react";

const AboutPage = () => {
  return (
    <div style={{ paddingTop: "120px", paddingBottom: "120px" }}>
      <div className="kcttw-container">
        {/* Hero Section */}
        <div style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto 80px" }}>
          <span style={{ fontSize: "11px", letterSpacing: "3px", fontWeight: "800", color: "var(--gold)", textTransform: "uppercase" }}>
            OUR HERITAGE & VISION
          </span>
          <h1 style={{ fontSize: "clamp(34px, 5vw, 60px)", fontWeight: "900", letterSpacing: "-1.5px", marginTop: "10px" }}>
            Kamba Collection <br />
            <span
              style={{
                background: "linear-gradient(135deg, #ffffff 40%, var(--gold) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}
            >
              To The World
            </span>
          </h1>
          <p style={{ fontSize: "16px", color: "var(--text-muted)", lineHeight: "1.8", marginTop: "20px" }}>
            Born from authentic culture and elevated by timeless luxury craftsmanship. KCTTW is a movement engineered for those who carry greatness without saying a word.
          </p>
        </div>

        {/* Story Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "50px",
            alignItems: "center",
            marginBottom: "100px"
          }}
        >
          <div className="glass-panel" style={{ padding: "40px", position: "relative" }}>
            <span className="badge-gold" style={{ marginBottom: "16px" }}>
              <Sparkles size={13} /> THE STORY
            </span>
            <h2 style={{ fontSize: "28px", fontWeight: "900", marginBottom: "16px" }}>
              From Local Roots to Global Renown
            </h2>
            <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: "1.8", marginBottom: "16px" }}>
              KCTTW began with a singular vision: to craft streetwear that stands beside the world's most revered fashion houses while fiercely honoring African identity, strength, and elegance.
            </p>
            <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: "1.8" }}>
              Every stitch, monogram, and cut in our archive undergoes meticulous prototyping to ensure longevity, unrivaled comfort, and commanding presence.
            </p>
          </div>

          <div
            className="glass-panel"
            style={{
              padding: "40px",
              background: "radial-gradient(circle at center, rgba(212,175,55,0.08), rgba(0,0,0,0.6))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <img
              src="/assets/logo.png"
              alt="KCTTW Brand Emblem"
              style={{ width: "100%", maxWidth: "340px", objectFit: "contain", filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.8))" }}
            />
          </div>
        </div>

        {/* Pillars / Values */}
        <div style={{ marginBottom: "100px" }}>
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <span style={{ fontSize: "11px", letterSpacing: "3px", fontWeight: "800", color: "var(--gold)", textTransform: "uppercase" }}>
              CORE PILLARS
            </span>
            <h2 style={{ fontSize: "32px", fontWeight: "900", marginTop: "8px" }}>
              The Standard We Uphold
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "24px"
            }}
          >
            <div className="glass-panel" style={{ padding: "30px" }}>
              <Shield size={32} color="var(--gold)" style={{ marginBottom: "16px" }} />
              <h3 style={{ fontSize: "18px", fontWeight: "800", marginBottom: "10px" }}>
                1. Uncompromising Quality
              </h3>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: "1.7" }}>
                We source only heavyweight combed cottons, durable structural crowns, and anti-fade embroidery threads.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: "30px" }}>
              <Globe size={32} color="var(--gold)" style={{ marginBottom: "16px" }} />
              <h3 style={{ fontSize: "18px", fontWeight: "800", marginBottom: "10px" }}>
                2. Global Reach
              </h3>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: "1.7" }}>
                From Lagos to London and Atlanta, our logistics network provides swift, trackable door-to-door delivery.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: "30px" }}>
              <Award size={32} color="var(--gold)" style={{ marginBottom: "16px" }} />
              <h3 style={{ fontSize: "18px", fontWeight: "800", marginBottom: "10px" }}>
                3. Limited Exclusivity
              </h3>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: "1.7" }}>
                Our drops are produced in limited quantities to guarantee your style remains distinct and unique.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="glass-panel" style={{ padding: "60px 30px", textAlign: "center", background: "linear-gradient(135deg, rgba(212,175,55,0.08), rgba(255,255,255,0.02))" }}>
          <h2 style={{ fontSize: "32px", fontWeight: "900", marginBottom: "14px" }}>
            Ready to Wear Greatness?
          </h2>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", maxWidth: "500px", margin: "0 auto 30px" }}>
            Discover our newest collection of signature caps, collared shirts, and heavyweight tees.
          </p>
          <Link to="/products" className="btn-gold-kcttw">
            <span>SHOP THE COLLECTION</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
