import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff, Lock, Mail, ArrowRight, AlertCircle, Sparkles, ShieldCheck, ArrowUpRight } from "lucide-react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await login(email, password, remember);
      if (user?.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate(redirectPath, { replace: true });
      }
    } catch (err) {
      setError(err.message || "Invalid email or password.");
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
              LEFT SIDE: LUXURY SIGN IN FORM
          ===================================================== */}
          <div style={{ padding: "clamp(30px, 5vw, 60px)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ marginBottom: "32px" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--gold)", fontSize: "10px", fontWeight: "900", letterSpacing: "2.5px", textTransform: "uppercase", marginBottom: "8px" }}>
                <Sparkles size={12} /> VIP ACCESS
              </div>
              <h1 style={{ fontSize: "32px", fontWeight: "900", letterSpacing: "-1px", color: "#ffffff", margin: 0 }}>
                Welcome Back
              </h1>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "6px" }}>
                Enter your credentials to access your archive & orders.
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
                  marginBottom: "24px",
                  fontSize: "13px",
                  fontWeight: "600"
                }}
              >
                <AlertCircle size={18} color="var(--danger)" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: "800", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px", color: "var(--text-muted)" }}>
                  Email Address
                </label>
                <div style={{ position: "relative" }}>
                  <Mail
                    size={16}
                    style={{
                      position: "absolute",
                      left: "18px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "var(--text-dim)"
                    }}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    className="kcttw-input"
                    style={{ paddingLeft: "46px" }}
                  />
                </div>
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <label style={{ fontSize: "11px", fontWeight: "800", letterSpacing: "1px", textTransform: "uppercase", color: "var(--text-muted)" }}>
                    Password
                  </label>
                </div>
                <div style={{ position: "relative" }}>
                  <Lock
                    size={16}
                    style={{
                      position: "absolute",
                      left: "18px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "var(--text-dim)"
                    }}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="kcttw-input"
                    style={{ paddingLeft: "46px", paddingRight: "46px" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "18px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      color: "var(--text-dim)",
                      padding: 0
                    }}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", color: "var(--text-muted)", userSelect: "none" }}>
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    style={{ accentColor: "var(--gold)" }}
                  />
                  <span>Stay signed in</span>
                </label>

                <a
                  href="https://wa.me/2349072585516?text=Hello%20KCTTW%2C%20I%20need%20help%20recovering%20my%20account"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "var(--text-dim)", fontSize: "12px" }}
                >
                  Forgot Password?
                </a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-gold-kcttw"
                style={{ width: "100%", height: "52px", marginTop: "8px" }}
              >
                {loading ? (
                  <span>AUTHENTICATING...</span>
                ) : (
                  <>
                    <span>ENTER VIP PORTAL</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)", marginTop: "32px", paddingTop: "20px", textAlign: "center", fontSize: "13px", color: "var(--text-muted)" }}>
              New to the KCTTW tribe?{" "}
              <Link to="/register" style={{ color: "var(--gold)", fontWeight: "800", marginLeft: "4px" }}>
                Create Member Account →
              </Link>
            </div>
          </div>

          {/* =====================================================
              RIGHT SIDE: EDITORIAL PRODUCT SHOWCASE
          ===================================================== */}
          <div
            style={{
              background: "radial-gradient(circle at 60% 40%, rgba(212, 175, 55, 0.12), rgba(10, 10, 10, 0.95))",
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
                ICONIC DROP • VOL. 01
              </div>
              <h2 style={{ fontSize: "24px", fontWeight: "900", color: "#ffffff", letterSpacing: "-0.5px" }}>
                Signature Luxe Cap
              </h2>
              <span style={{ fontSize: "18px", fontWeight: "900", color: "var(--gold)" }}>
                ₦15,000
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
                src="/images/cap.png"
                alt="KCTTW Signature Cap"
                style={{
                  width: "100%",
                  maxWidth: "280px",
                  height: "auto",
                  objectFit: "contain",
                  filter: "drop-shadow(0 25px 50px rgba(0,0,0,0.9))",
                  transform: "rotate(-6deg) scale(1.05)"
                }}
              />
            </div>

            {/* Bottom Statement & Perks */}
            <div style={{ position: "relative", zIndex: 2, borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "20px" }}>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", fontStyle: "italic", lineHeight: "1.6", margin: "0 0 14px" }}>
                "Confidence isn't loud. It is cut into every seam."
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                <span style={{ fontSize: "10px", fontWeight: "800", letterSpacing: "1px", background: "rgba(255, 255, 255, 0.06)", border: "1px solid rgba(255, 255, 255, 0.1)", padding: "4px 10px", borderRadius: "20px", color: "#fff" }}>
                  ✓ 100% EMBROIDERED
                </span>
                <span style={{ fontSize: "10px", fontWeight: "800", letterSpacing: "1px", background: "rgba(255, 255, 255, 0.06)", border: "1px solid rgba(255, 255, 255, 0.1)", padding: "4px 10px", borderRadius: "20px", color: "#fff" }}>
                  ✓ TRACKED COURIER
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
