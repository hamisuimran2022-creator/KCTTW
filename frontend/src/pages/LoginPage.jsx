import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff, Lock, Mail, ArrowRight, AlertCircle, ArrowLeft, Sparkles } from "lucide-react";

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
          LEFT HALF: FULL-BLEED SIGN IN CANVAS
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
        <div style={{ maxWidth: "440px", width: "100%", margin: "40px auto" }}>
          <div style={{ marginBottom: "36px" }}>
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
                marginBottom: "10px"
              }}
            >
              <Sparkles size={12} /> VIP ACCESS PORTAL
            </div>
            <h1 style={{ fontSize: "clamp(32px, 4vw, 42px)", fontWeight: "900", letterSpacing: "-1.5px", margin: 0, lineHeight: "1.1" }}>
              Sign In to KCTTW
            </h1>
            <p style={{ fontSize: "14px", color: "var(--text-muted)", marginTop: "10px" }}>
              Access your saved addresses, past drops & live order tracking.
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

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: "800", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px", color: "var(--text-muted)" }}>
                Email Address
              </label>
              <div style={{ position: "relative" }}>
                <Mail
                  size={17}
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
                  style={{ height: "54px", paddingLeft: "48px", borderRadius: "14px" }}
                />
              </div>
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <label style={{ fontSize: "11px", fontWeight: "800", letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--text-muted)" }}>
                  Password
                </label>
              </div>
              <div style={{ position: "relative" }}>
                <Lock
                  size={17}
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
                  style={{ height: "54px", paddingLeft: "48px", paddingRight: "48px", borderRadius: "14px" }}
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

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "13px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", color: "var(--text-muted)", userSelect: "none" }}>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  style={{ accentColor: "var(--gold)" }}
                />
                <span>Remember me</span>
              </label>

              <a
                href="https://wa.me/2349072585516?text=Hello%20KCTTW%2C%20I%20need%20assistance%20recovering%20my%20account"
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
              style={{ width: "100%", height: "54px", borderRadius: "14px", marginTop: "10px" }}
            >
              {loading ? (
                <span>AUTHENTICATING...</span>
              ) : (
                <>
                  <span>SIGN IN TO VIP PORTAL</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div style={{ marginTop: "36px", paddingTop: "24px", borderTop: "1px solid rgba(255, 255, 255, 0.08)", fontSize: "13px", color: "var(--text-muted)", textAlign: "center" }}>
            Don't have an official account?{" "}
            <Link to="/register" style={{ color: "var(--gold)", fontWeight: "800", marginLeft: "4px" }}>
              Create Membership →
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
          background: "radial-gradient(circle at 60% 40%, rgba(212, 175, 55, 0.15), rgba(12, 12, 12, 0.98))",
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
            FEATURED DROP • ARCHIVE 01
          </div>
          <h2 style={{ fontSize: "clamp(26px, 3.5vw, 38px)", fontWeight: "900", color: "#ffffff", letterSpacing: "-1px", margin: 0 }}>
            Signature Luxe Cap
          </h2>
          <div style={{ fontSize: "20px", fontWeight: "900", color: "var(--gold)", marginTop: "6px" }}>
            ₦15,000
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
            src="/images/cap.png"
            alt="KCTTW Signature Cap"
            style={{
              width: "100%",
              maxWidth: "380px",
              height: "auto",
              objectFit: "contain",
              filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.95))",
              transform: "rotate(-6deg) scale(1.08)"
            }}
          />
        </div>

        {/* Bottom Craftsmanship Manifesto */}
        <div style={{ position: "relative", zIndex: 2, borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "24px" }}>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.75)", fontStyle: "italic", lineHeight: "1.7", margin: "0 0 16px" }}>
            "Confidence isn't loud. It is engineered with every thread, stitch, and silhouette."
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            <span style={{ fontSize: "11px", fontWeight: "800", letterSpacing: "1px", background: "rgba(255, 255, 255, 0.06)", border: "1px solid rgba(255, 255, 255, 0.12)", padding: "6px 14px", borderRadius: "20px", color: "#fff" }}>
              ✓ HANDCRAFTED EMBROIDERY
            </span>
            <span style={{ fontSize: "11px", fontWeight: "800", letterSpacing: "1px", background: "rgba(255, 255, 255, 0.06)", border: "1px solid rgba(255, 255, 255, 0.12)", padding: "6px 14px", borderRadius: "20px", color: "#fff" }}>
              ✓ EXPRESS COURIER
            </span>
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

export default LoginPage;
