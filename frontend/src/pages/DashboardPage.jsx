import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { orderApi } from "../services/api";
import { LayoutDashboard, ShoppingBag, User, LogOut, Package, Clock, CheckCircle2, MessageCircle, ArrowRight } from "lucide-react";

const DashboardPage = () => {
  const { user, isLoggedIn, logout, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [activeTab, setActiveTab] = useState("orders"); // 'orders' | 'profile'
  const [editForm, setEditForm] = useState({
    fullName: user?.fullName || "",
    phone: user?.phone || "",
    street: user?.address?.street || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "Lagos"
  });
  const [saveStatus, setSaveStatus] = useState("");

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await orderApi.getMyOrders();
        if (res.success && res.data?.orders) {
          setOrders(res.data.orders);
        }
      } catch (err) {
        console.error("Failed to load orders:", err);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [isLoggedIn, navigate]);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaveStatus("Saving...");
    try {
      await updateProfile({
        fullName: editForm.fullName,
        phone: editForm.phone,
        address: {
          street: editForm.street,
          city: editForm.city,
          state: editForm.state
        }
      });
      setSaveStatus("Profile updated successfully! ✅");
      setTimeout(() => setSaveStatus(""), 3000);
    } catch (err) {
      setSaveStatus(err.message || "Failed to update profile.");
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "#2ed573";
      case "processing":
      case "shipped":
        return "#0dcaf0";
      case "cancelled":
        return "#ff4757";
      default:
        return "var(--gold)";
    }
  };

  if (!isLoggedIn) return null;

  return (
    <div style={{ paddingTop: "120px", paddingBottom: "120px" }}>
      <div className="kcttw-container">
        {/* Header */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
            marginBottom: "40px"
          }}
        >
          <div>
            <span style={{ fontSize: "11px", letterSpacing: "3px", fontWeight: "800", color: "var(--gold)", textTransform: "uppercase" }}>
              VIP MEMBER PORTAL
            </span>
            <h1 style={{ fontSize: "clamp(26px, 4vw, 40px)", fontWeight: "900", letterSpacing: "-1px", marginTop: "6px" }}>
              Welcome, {user?.fullName?.split(" ")[0]} ✨
            </h1>
          </div>

          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 20px",
              borderRadius: "12px",
              background: "rgba(255, 71, 87, 0.1)",
              border: "1px solid rgba(255, 71, 87, 0.2)",
              color: "var(--danger)",
              fontSize: "12px",
              fontWeight: "700"
            }}
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>

        {/* Dashboard Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "30px",
            alignItems: "flex-start"
          }}
        >
          {/* Left Sidebar: Profile Card & Navigation */}
          <div className="glass-panel" style={{ padding: "30px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  background: "var(--gold)",
                  color: "#000",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "22px",
                  fontWeight: "900"
                }}
              >
                {user?.fullName?.charAt(0).toUpperCase() || "K"}
              </div>

              <div>
                <h3 style={{ fontSize: "16px", fontWeight: "800", margin: 0, color: "#fff" }}>
                  {user?.fullName}
                </h3>
                <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{user?.email}</span>
                <div style={{ marginTop: "4px" }}>
                  <span className="badge-gold" style={{ fontSize: "8.5px", padding: "4px 8px" }}>
                    VIP CUSTOMER
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "20px" }}>
              <button
                onClick={() => setActiveTab("orders")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 16px",
                  borderRadius: "10px",
                  background: activeTab === "orders" ? "#ffffff" : "transparent",
                  color: activeTab === "orders" ? "#000000" : "#ffffff",
                  border: "none",
                  fontSize: "13px",
                  fontWeight: "700",
                  textAlign: "left"
                }}
              >
                <Package size={16} /> My Orders ({orders.length})
              </button>

              <button
                onClick={() => setActiveTab("profile")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 16px",
                  borderRadius: "10px",
                  background: activeTab === "profile" ? "#ffffff" : "transparent",
                  color: activeTab === "profile" ? "#000000" : "#ffffff",
                  border: "none",
                  fontSize: "13px",
                  fontWeight: "700",
                  textAlign: "left"
                }}
              >
                <User size={16} /> Edit Profile & Address
              </button>

              <a
                href="https://wa.me/2349072585516"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 16px",
                  borderRadius: "10px",
                  color: "#2ed573",
                  fontSize: "13px",
                  fontWeight: "700",
                  marginTop: "10px"
                }}
              >
                <MessageCircle size={16} /> WhatsApp VIP Concierge
              </a>
            </div>
          </div>

          {/* Right Area: Dynamic View */}
          <div style={{ gridColumn: "span 2" }}>
            {activeTab === "orders" ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <h3 style={{ fontSize: "20px", fontWeight: "900", margin: 0 }}>
                  Order History
                </h3>

                {loadingOrders ? (
                  <div className="glass-panel" style={{ padding: "40px", textAlign: "center" }}>
                    Loading your orders...
                  </div>
                ) : orders.length === 0 ? (
                  <div className="glass-panel" style={{ padding: "60px 30px", textAlign: "center" }}>
                    <ShoppingBag size={36} color="var(--gold)" style={{ margin: "0 auto 16px" }} />
                    <h4 style={{ fontSize: "18px", fontWeight: "800", marginBottom: "8px" }}>
                      No Orders Placed Yet
                    </h4>
                    <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "20px" }}>
                      Explore the collection and make your first luxury purchase.
                    </p>
                    <Link to="/products" className="btn-gold-kcttw">Browse Collection</Link>
                  </div>
                ) : (
                  orders.map((order) => (
                    <div key={order._id} className="glass-panel" style={{ padding: "24px" }}>
                      {/* Order Header */}
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: "12px",
                          borderBottom: "1px solid rgba(255,255,255,0.08)",
                          paddingBottom: "16px",
                          marginBottom: "16px"
                        }}
                      >
                        <div>
                          <div style={{ fontSize: "11px", color: "var(--text-dim)" }}>ORDER NUMBER</div>
                          <div style={{ fontSize: "15px", fontWeight: "800", color: "#fff" }}>
                            #{order.orderNumber}
                          </div>
                          <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                            {new Date(order.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric"
                            })}
                          </div>
                        </div>

                        <div style={{ textAlign: "right" }}>
                          <span
                            style={{
                              display: "inline-block",
                              padding: "4px 12px",
                              borderRadius: "20px",
                              fontSize: "11px",
                              fontWeight: "800",
                              background: `${getStatusColor(order.status)}22`,
                              color: getStatusColor(order.status),
                              border: `1px solid ${getStatusColor(order.status)}44`
                            }}
                          >
                            {order.status}
                          </span>
                          <div style={{ fontSize: "15px", fontWeight: "900", color: "#fff", marginTop: "4px" }}>
                            ₦{Number(order.total).toLocaleString("en-NG")}
                          </div>
                        </div>
                      </div>

                      {/* Items List */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        {order.items?.map((item, idx) => (
                          <div key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                            <div>
                              <strong style={{ color: "#ffffff" }}>{item.name}</strong>
                              <span style={{ color: "var(--text-dim)", marginLeft: "8px" }}>
                                ({item.color} • {item.size} x{item.quantity})
                              </span>
                            </div>
                            <span style={{ fontWeight: "700" }}>
                              ₦{Number(item.itemTotal || item.price * item.quantity).toLocaleString("en-NG")}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              /* Profile Edit Form */
              <div className="glass-panel" style={{ padding: "30px" }}>
                <h3 style={{ fontSize: "20px", fontWeight: "900", marginBottom: "20px" }}>
                  Edit Profile & Address
                </h3>

                {saveStatus && (
                  <div style={{ padding: "12px 16px", borderRadius: "10px", background: "rgba(212,175,55,0.1)", border: "1px solid var(--gold)", color: "#fff", marginBottom: "20px", fontSize: "13px" }}>
                    {saveStatus}
                  </div>
                )}

                <form onSubmit={handleProfileSave} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "700", marginBottom: "6px", color: "var(--text-muted)" }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={editForm.fullName}
                      onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                      required
                      className="kcttw-input"
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "700", marginBottom: "6px", color: "var(--text-muted)" }}>
                      Phone / WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      required
                      className="kcttw-input"
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "700", marginBottom: "6px", color: "var(--text-muted)" }}>
                      Street Address
                    </label>
                    <input
                      type="text"
                      value={editForm.street}
                      onChange={(e) => setEditForm({ ...editForm, street: e.target.value })}
                      placeholder="e.g. 10 Victoria Island"
                      className="kcttw-input"
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: "700", marginBottom: "6px", color: "var(--text-muted)" }}>
                        City
                      </label>
                      <input
                        type="text"
                        value={editForm.city}
                        onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                        className="kcttw-input"
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: "700", marginBottom: "6px", color: "var(--text-muted)" }}>
                        State
                      </label>
                      <input
                        type="text"
                        value={editForm.state}
                        onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
                        className="kcttw-input"
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn-gold-kcttw" style={{ width: "fit-content", marginTop: "10px" }}>
                    SAVE CHANGES
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
