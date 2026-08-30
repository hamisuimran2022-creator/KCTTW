import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { User, Mail, Phone, Lock, Eye, EyeOff, AlertCircle, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

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
    <div style={{ minHeight: "100vh", paddingTop: "86px", background: "#050505", display: "flex" }}>
      <div
        className="kcttw-container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: "40px",
          paddingBottom: "60px",
          width: "100%"
        }}
      >
        <div
          className="glass-panel"
          style={{
            width: "100%",
            maxWidth: "1080px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            overflow: "hidden",
            borderRadius: "28px",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            boxShadow: "0 40px 100px rgba(0, 0, 0, 0.7)"
          }}
        >
          {/* =====================================================
              LEFT SIDE: REGISTRATION FORM
          ===================================================== */}
          <div style={{ padding: "clamp(30px, 5vw, 60px)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ marginBottom: "28px" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--gold)", fontSize: "10px", fontWeight: "900", letterSpacing: "2.5px", textTransform: "uppercase", marginBottom: "8px" }}>
                <Sparkles size={12} /> JOIN THE MOVEMENT
              </div>
              <h1 style={{ fontSize: "32px", fontWeight: "900", letterSpacing: "-1px", color: "#ffffff", margin: 0 }}>
                Claim Your Membership
              </h1>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "6px" }}>
                Create your VIP account for private drops, express dispatch & concierge tracking.
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
                <label style={{ display: "block", fontSize: "11px", fontWeight: "800", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px", color: "var(--text-muted)" }}>
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
                    style={{ paddingLeft: "46px" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: "800", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px", color: "var(--text-muted)" }}>
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
                    style={{ paddingLeft: "46px" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: "800", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px", color: "var(--text-muted)" }}>
                  Phone / WhatsApp Number *
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
                    style={{ paddingLeft: "46px" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: "800", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px", color: "var(--text-muted)" }}>
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
                      style={{ paddingLeft: "42px", paddingRight: "36px" }}
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
                  <label style={{ display: "block", fontSize: "11px", fontWeight: "800", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px", color: "var(--text-muted)" }}>
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
                      style={{ paddingLeft: "42px" }}
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-gold-kcttw"
                style={{ width: "100%", height: "52px", marginTop: "12px" }}
              >
                {loading ? (
                  <span>ACTIVATING ACCOUNT...</span>
                ) : (
                  <>
                    <span>COMPLETE REGISTRATION</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)", marginTop: "28px", paddingTop: "18px", textAlign: "center", fontSize: "13px", color: "var(--text-muted)" }}>
              Already registered with KCTTW?{" "}
              <Link to="/login" style={{ color: "var(--gold)", fontWeight: "800", marginLeft: "4px" }}>
                Sign In Here →
              </Link>
            </div>
          </div>

          {/* =====================================================
              RIGHT SIDE: EDITORIAL PRODUCT SHOWCASE
          ===================================================== */}
          <div
            style={{
              background: "radial-gradient(circle at 40% 60%, rgba(212, 175, 55, 0.1), rgba(10, 10, 10, 0.95))",
              borderLeft: "1px solid rgba(255, 255, 255, 0.08)",
              padding: "clamp(30px, 5vw, 50px)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              position: "relative",
              overflow: "hidden"
            }}
          >
            {/* Ambient Watermark */}
            <div
              style={{
                position: "absolute",
                top: "10px",
                right: "-20px",
                fontSize: "120px",
                fontWeight: "900",
                color: "rgba(255, 255, 255, 0.02)",
                letterSpacing: "-4px",
                pointerEvents: "none",
                userSelect: "none"
              }}
            >
              KCTTW
            </div>

            {/* Top Tag & Drop Title */}
            <div style={{ position: "relative", zIndex: 2 }}>
              <div className="badge-gold" style={{ marginBottom: "12px", width: "fit-content" }}>
                CURATED TAILORING
              </div>
              <h2 style={{ fontSize: "24px", fontWeight: "900", color: "#ffffff", letterSpacing: "-0.5px" }}>
                Executive Collared Shirt
              </h2>
              <span style={{ fontSize: "18px", fontWeight: "900", color: "var(--gold)" }}>
                ₦25,000
              </span>
            </div>

            {/* Product Centerpiece */}
            <div
              style={{
                position: "relative",
                zIndex: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px 0"
              }}
            >
              <img
                src="/assets/collared-shirt2.png"
                alt="KCTTW Collared Shirt"
                style={{
                  width: "100%",
                  maxWidth: "300px",
                  height: "auto",
                  objectFit: "contain",
                  filter: "drop-shadow(0 25px 50px rgba(0,0,0,0.9))",
                  transform: "rotate(4deg) scale(1.05)"
                }}
              />
            </div>

            {/* Bottom Statement & Member Perks */}
            <div style={{ position: "relative", zIndex: 2, borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "20px" }}>
              <h4 style={{ fontSize: "13px", fontWeight: "800", color: "#fff", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "10px" }}>
                Member Privileges Included:
              </h4>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "12px", color: "rgba(255,255,255,0.7)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <CheckCircle2 size={14} color="var(--gold)" />
                  <span>Early notification on limited edition capsule releases.</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <CheckCircle2 size={14} color="var(--gold)" />
                  <span>Direct WhatsApp fulfillment concierge for live dispatch tracking.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
