import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { User, Mail, Phone, Lock, Eye, EyeOff, AlertCircle, ArrowRight, ArrowLeft, Sparkles, CheckCircle2 } from "lucide-react";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      await register({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        background: "#080808",
        color: "#ffffff",
        overflowX: "hidden"
      }}
    >
      {/* =====================================================
          LEFT HALF: FULL-BLEED REGISTRATION CANVAS
      ===================================================== */}
      <div
        style={{
          flex: "1 1 50%",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "clamp(30px, 6vw, 70px)",
          background: "#080808"
        }}
      >
        {/* Top Navigation Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link
            to="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "12px",
              fontWeight: "800",
              letterSpacing: "1.5px",
              color: "var(--text-muted)",
              textTransform: "uppercase"
            }}
          >
            <ArrowLeft size={16} /> Back to Store
          </Link>

          <Link to="/" style={{ textAlign: "right" }}>
            <span style={{ fontSize: "20px", fontWeight: "900", letterSpacing: "3px", color: "#fff", display: "block" }}>
              KCTTW
            </span>
            <span style={{ fontSize: "7px", letterSpacing: "2.5px", fontWeight: "800", color: "var(--gold)", textTransform: "uppercase" }}>
              TO THE WORLD
            </span>
          </Link>
        </div>

        {/* Center Form Area */}
        <div style={{ maxWidth: "460px", width: "100%", margin: "30px auto" }}>
          <div style={{ marginBottom: "28px" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                color: "var(--gold)",
                fontSize: "10px",
                fontWeight: "900",
                letterSpacing: "2.5px",
                textTransform: "uppercase",
                marginBottom: "8px"
              }}
            >
              <Sparkles size={12} /> OFFICIAL MEMBERSHIP
            </div>
            <h1 style={{ fontSize: "clamp(30px, 3.8vw, 40px)", fontWeight: "900", letterSpacing: "-1.5px", margin: 0, lineHeight: "1.1" }}>
              Join the KCTTW Tribe
            </h1>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "8px" }}>
              Get priority drop alerts, swift one-click checkout & live courier tracking.
            </p>
          </div>

          {error && (
            <div
              style={{
                padding: "14px 18px",
                borderRadius: "12px",
                background: "rgba(255, 71, 87, 0.12)",
                border: "1px solid var(--danger)",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "20px",
                fontSize: "13px",
                fontWeight: "600"
              }}
            >
              <AlertCircle size={18} color="var(--danger)" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: "800", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "6px", color: "var(--text-muted)" }}>
                Full Name *
              </label>
              <div style={{ position: "relative" }}>
                <User size={16} style={{ position: "absolute", left: "18px", top: "50%", transform: "translateY(-50%)", color: "var(--text-dim)" }} />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Chukwudi Emeka"
                  required
                  className="kcttw-input"
                  style={{ height: "52px", paddingLeft: "48px", borderRadius: "14px" }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: "800", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "6px", color: "var(--text-muted)" }}>
                Email Address *
              </label>
              <div style={{ position: "relative" }}>
                <Mail size={16} style={{ position: "absolute", left: "18px", top: "50%", transform: "translateY(-50%)", color: "var(--text-dim)" }} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  required
                  className="kcttw-input"
                  style={{ height: "52px", paddingLeft: "48px", borderRadius: "14px" }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: "800", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "6px", color: "var(--text-muted)" }}>
                Phone / WhatsApp *
              </label>
              <div style={{ position: "relative" }}>
                <Phone size={16} style={{ position: "absolute", left: "18px", top: "50%", transform: "translateY(-50%)", color: "var(--text-dim)" }} />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+234 800 000 0000"
                  required
                  className="kcttw-input"
                  style={{ height: "52px", paddingLeft: "48px", borderRadius: "14px" }}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: "800", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "6px", color: "var(--text-muted)" }}>
                  Password *
                </label>
                <div style={{ position: "relative" }}>
                  <Lock size={16} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "var(--text-dim)" }} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="kcttw-input"
                    style={{ height: "52px", paddingLeft: "44px", paddingRight: "36px", borderRadius: "14px" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-dim)", padding: 0 }}
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: "800", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "6px", color: "var(--text-muted)" }}>
                  Confirm *
                </label>
                <div style={{ position: "relative" }}>
                  <Lock size={16} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "var(--text-dim)" }} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="kcttw-input"
                    style={{ height: "52px", paddingLeft: "44px", borderRadius: "14px" }}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-gold-kcttw"
              style={{ width: "100%", height: "54px", borderRadius: "14px", marginTop: "8px" }}
            >
              {loading ? (
                <span>CREATING ACCOUNT...</span>
              ) : (
                <>
                  <span>ACTIVATE MEMBERSHIP</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div style={{ marginTop: "28px", paddingTop: "18px", borderTop: "1px solid rgba(255, 255, 255, 0.08)", fontSize: "13px", color: "var(--text-muted)", textAlign: "center" }}>
            Already an official member?{" "}
            <Link to="/login" style={{ color: "var(--gold)", fontWeight: "800", marginLeft: "4px" }}>
              Sign In Here →
            </Link>
          </div>
        </div>

        {/* Bottom Micro Footer */}
        <div style={{ fontSize: "11px", color: "var(--text-dim)", textAlign: "center" }}>
          © {new Date().getFullYear()} KCTTW Luxury Fashion. All Rights Reserved.
        </div>
      </div>

      {/* =====================================================
          RIGHT HALF: FULL-BLEED EDITORIAL SHOWCASE
      ===================================================== */}
      <div
        className="auth-editorial-panel"
        style={{
          flex: "1 1 50%",
          minHeight: "100vh",
          background: "radial-gradient(circle at 40% 60%, rgba(212, 175, 55, 0.12), rgba(12, 12, 12, 0.98))",
          borderLeft: "1px solid rgba(255, 255, 255, 0.08)",
          padding: "clamp(40px, 6vw, 80px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          overflow: "hidden"
        }}
      >
        {/* Background Ambient Branding */}
        <div
          style={{
            position: "absolute",
            bottom: "0",
            right: "-20px",
            fontSize: "clamp(120px, 18vw, 240px)",
            fontWeight: "900",
            color: "rgba(255, 255, 255, 0.02)",
            letterSpacing: "-6px",
            pointerEvents: "none",
            userSelect: "none",
            lineHeight: "0.8"
          }}
        >
          KCTTW
        </div>

        {/* Top Drop Tag */}
        <div style={{ position: "relative", zIndex: 2 }}>
          <div className="badge-gold" style={{ marginBottom: "12px", width: "fit-content" }}>
            TAILORED STREETWEAR • VOL. 02
          </div>
          <h2 style={{ fontSize: "clamp(26px, 3.5vw, 38px)", fontWeight: "900", color: "#ffffff", letterSpacing: "-1px", margin: 0 }}>
            Executive Collared Shirt
          </h2>
          <div style={{ fontSize: "20px", fontWeight: "900", color: "var(--gold)", marginTop: "6px" }}>
            ₦25,000
          </div>
        </div>

        {/* High-Resolution Center Piece */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 0"
          }}
        >
          <img
            src="/assets/collared-shirt2.png"
            alt="KCTTW Executive Shirt"
            style={{
              width: "100%",
              maxWidth: "400px",
              height: "auto",
              objectFit: "contain",
              filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.95))",
              transform: "rotate(4deg) scale(1.08)"
            }}
          />
        </div>

        {/* Bottom Privileges */}
        <div style={{ position: "relative", zIndex: 2, borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "24px" }}>
          <h4 style={{ fontSize: "12px", fontWeight: "900", color: "#fff", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "12px" }}>
            Member Privileges:
          </h4>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px", color: "rgba(255,255,255,0.75)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <CheckCircle2 size={16} color="var(--gold)" />
              <span>Direct access to limited release capsules before public launch.</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <CheckCircle2 size={16} color="var(--gold)" />
              <span>Priority WhatsApp concierge dispatch & courier tracking.</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .auth-editorial-panel {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default RegisterPage;
