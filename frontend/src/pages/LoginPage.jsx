import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff, Lock, Mail, ArrowRight, AlertCircle } from "lucide-react";

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
      await login(email, password, remember);
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        paddingTop: "140px",
        paddingBottom: "120px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <div className="kcttw-container" style={{ maxWidth: "480px" }}>
        <div className="glass-panel" style={{ padding: "40px 30px" }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "30px" }}>
            <span style={{ fontSize: "10px", letterSpacing: "3px", fontWeight: "800", color: "var(--gold)", textTransform: "uppercase" }}>
              VIP ACCESS
            </span>
            <h1 style={{ fontSize: "28px", fontWeight: "900", marginTop: "6px", color: "#fff" }}>
              Sign In
            </h1>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "6px" }}>
              Access your order history and exclusive drops.
            </p>
          </div>

          {error && (
            <div
              style={{
                padding: "12px 16px",
                borderRadius: "10px",
                background: "rgba(255, 71, 87, 0.15)",
                border: "1px solid var(--danger)",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "20px",
                fontSize: "13px"
              }}
            >
              <AlertCircle size={18} color="var(--danger)" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "700", marginBottom: "6px", color: "var(--text-muted)" }}>
                Email Address
              </label>
              <div style={{ position: "relative" }}>
                <Mail
                  size={16}
                  style={{
                    position: "absolute",
                    left: "16px",
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
                  style={{ paddingLeft: "44px" }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "700", marginBottom: "6px", color: "var(--text-muted)" }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <Lock
                  size={16}
                  style={{
                    position: "absolute",
                    left: "16px",
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
                  style={{ paddingLeft: "44px", paddingRight: "44px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "16px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "var(--text-dim)"
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", color: "var(--text-muted)" }}>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Remember me
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-gold-kcttw"
              style={{ width: "100%", height: "50px", marginTop: "10px" }}
            >
              {loading ? <span>AUTHENTICATING...</span> : <span>SIGN IN</span>}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: "24px", fontSize: "13px", color: "var(--text-muted)" }}>
            Don't have a VIP account?{" "}
            <Link to="/register" style={{ color: "var(--gold)", fontWeight: "700" }}>
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
