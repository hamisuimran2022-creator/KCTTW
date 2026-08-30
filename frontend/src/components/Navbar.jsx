import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { ShoppingBag, User, Menu, X, LogOut, LayoutDashboard, ChevronDown } from "lucide-react";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const { cartCount } = useCart();
  const { user, isLoggedIn, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  const navLinks = isLoggedIn
    ? [
        { name: "COLLECTION", path: "/products" },
        { name: "MY BAG", path: "/cart" },
        { name: "VIP DASHBOARD", path: "/dashboard" },
        ...(user?.role === "admin" ? [{ name: "ADMIN COMMAND", path: "/admin" }] : []),
        { name: "ABOUT", path: "/about" },
        { name: "CONTACT", path: "/contact" }
      ]
    : [
        { name: "HOME", path: "/" },
        { name: "COLLECTION", path: "/products" },
        { name: "ABOUT", path: "/about" },
        { name: "CONTACT", path: "/contact" }
      ];

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: scrolled ? "rgba(8, 8, 8, 0.92)" : "rgba(8, 8, 8, 0.65)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        transition: "all 0.3s ease"
      }}
    >
      <div
        className="kcttw-container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: scrolled ? "72px" : "86px",
          transition: "height 0.3s ease"
        }}
      >
        {/* Brand Logo */}
        <Link to="/" style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <span
            style={{
              fontSize: "24px",
              fontWeight: "900",
              letterSpacing: "3px",
              color: "#ffffff"
            }}
          >
            KCTTW
          </span>
          <span
            style={{
              fontSize: "7.5px",
              letterSpacing: "3px",
              fontWeight: "800",
              color: "var(--gold)",
              textTransform: "uppercase"
            }}
          >
            TO THE WORLD
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav
          style={{
            display: "none",
            alignItems: "center",
            gap: "36px"
          }}
          className="desktop-nav"
        >
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  fontSize: "12px",
                  fontWeight: "700",
                  letterSpacing: "2px",
                  color: isActive ? "#ffffff" : "var(--text-muted)",
                  position: "relative",
                  padding: "8px 0"
                }}
              >
                {link.name}
                {isActive && (
                  <span
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: "2px",
                      background: "var(--gold)",
                      borderRadius: "2px"
                    }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {/* Cart Icon Link */}
          <Link
            to="/cart"
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              color: "#ffffff",
              transition: "all 0.2s ease"
            }}
            aria-label="View Cart"
          >
            <ShoppingBag size={19} />
            {cartCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-5px",
                  right: "-5px",
                  background: "var(--gold)",
                  color: "#000000",
                  fontSize: "10px",
                  fontWeight: "900",
                  minWidth: "20px",
                  height: "20px",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 4px"
                }}
              >
                {cartCount}
              </span>
            )}
          </Link>

          {/* User Account / Auth Dropdown */}
          {isLoggedIn ? (
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  padding: "6px 14px",
                  borderRadius: "12px",
                  color: "#ffffff",
                  fontSize: "12px",
                  fontWeight: "700"
                }}
              >
                <span
                  style={{
                    width: "26px",
                    height: "26px",
                    borderRadius: "50%",
                    background: "var(--gold)",
                    color: "#000",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "900",
                    fontSize: "12px"
                  }}
                >
                  {user?.fullName?.charAt(0).toUpperCase() || "K"}
                </span>
                <span style={{ display: "none" }} className="desktop-username">
                  {user?.fullName?.split(" ")[0]}
                </span>
                <ChevronDown size={14} style={{ opacity: 0.6 }} />
              </button>

              {userDropdownOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 10px)",
                    right: 0,
                    width: "200px",
                    background: "#111111",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: "14px",
                    boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
                    padding: "8px",
                    zIndex: 100
                  }}
                >
                  <div style={{ padding: "8px 12px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                    <div style={{ fontSize: "12px", fontWeight: "800", color: "#fff" }}>{user?.fullName}</div>
                    <div style={{ fontSize: "10px", color: "var(--text-muted)", textOverflow: "ellipsis", overflow: "hidden" }}>
                      {user?.email}
                    </div>
                  </div>
                  <Link
                    to="/dashboard"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "10px 12px",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#ffffff",
                      borderRadius: "8px"
                    }}
                  >
                    <LayoutDashboard size={16} color="var(--gold)" />
                    My Dashboard
                  </Link>
                  {user?.role === "admin" && (
                    <Link
                      to="/admin"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "10px 12px",
                        fontSize: "12px",
                        fontWeight: "700",
                        color: "var(--gold)",
                        background: "rgba(212, 175, 55, 0.1)",
                        borderRadius: "8px",
                        marginBottom: "4px"
                      }}
                    >
                      <LayoutDashboard size={16} color="var(--gold)" />
                      Admin Command
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      navigate("/login");
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      width: "100%",
                      padding: "10px 12px",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "var(--danger)",
                      background: "none",
                      border: "none",
                      textAlign: "left",
                      borderRadius: "8px"
                    }}
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 18px",
                borderRadius: "12px",
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                color: "#ffffff",
                fontSize: "11px",
                fontWeight: "800",
                letterSpacing: "1.5px"
              }}
            >
              <User size={15} />
              <span>SIGN IN</span>
            </Link>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              color: "#ffffff"
            }}
            className="mobile-nav-toggle"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            background: "#0a0a0a",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "18px"
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                fontSize: "14px",
                fontWeight: "700",
                letterSpacing: "2px",
                color: location.pathname === link.path ? "var(--gold)" : "#ffffff"
              }}
            >
              {link.name}
            </Link>
          ))}
          {isLoggedIn && (
            <Link
              to="/dashboard"
              style={{
                fontSize: "14px",
                fontWeight: "700",
                letterSpacing: "2px",
                color: location.pathname === "/dashboard" ? "var(--gold)" : "#ffffff"
              }}
            >
              DASHBOARD
            </Link>
          )}
        </div>
      )}

      <style>{`
        @media (min-width: 900px) {
          .desktop-nav { display: flex !important; }
          .desktop-username { display: inline !important; }
          .mobile-nav-toggle { display: none !important; }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
