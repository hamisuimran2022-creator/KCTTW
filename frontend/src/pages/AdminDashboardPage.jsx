import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { adminApi, productApi } from "../services/api";
import {
  TrendingUp,
  Package,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  Plus,
  Trash2,
  ExternalLink,
  Shield,
  Upload,
  RefreshCw,
  LogOut,
  SlidersHorizontal,
  X
} from "lucide-react";

const AdminDashboardPage = () => {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("orders"); // 'orders' | 'customers' | 'products'
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [actionMessage, setActionMessage] = useState("");

  // New Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productForm, setProductForm] = useState({
    name: "",
    category: "caps",
    price: "",
    originalPrice: "",
    description: "",
    tag: "NEW DROP",
    colors: "Black, White, Navy",
    sizes: "S, M, L, XL",
    isFeatured: true
  });
  const [productImageFile, setProductImageFile] = useState(null);
  const [uploadingProduct, setUploadingProduct] = useState(false);

  // Fetch Dashboard Data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, ordersRes, customersRes, productsRes] = await Promise.all([
        adminApi.getStats().catch(() => ({ data: { stats: {} } })),
        adminApi.getOrders().catch(() => ({ data: { orders: [] } })),
        adminApi.getCustomers().catch(() => ({ data: { customers: [] } })),
        productApi.getAllProducts().catch(() => ({ data: { products: [] } }))
      ]);

      if (statsRes.data?.stats) setStats(statsRes.data.stats);
      if (ordersRes.data?.orders) setOrders(ordersRes.data.orders);
      if (customersRes.data?.customers) setCustomers(customersRes.data.customers);
      if (productsRes.data?.products) setProducts(productsRes.data.products);
    } catch (err) {
      console.error("Admin dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    if (user?.role !== "admin") {
      setLoading(false);
      return;
    }
    fetchData();
  }, [isLoggedIn, user, navigate]);

  // Update Order Status Handler
  const handleUpdateStatus = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    try {
      await adminApi.updateOrderStatus(orderId, { status: newStatus });
      setActionMessage(`Order status updated to ${newStatus} ✅`);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
      setTimeout(() => setActionMessage(""), 3000);
    } catch (err) {
      setActionMessage(`Failed to update order: ${err.message}`);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Toggle Customer Role
  const handleToggleRole = async (customerId, currentRole) => {
    const nextRole = currentRole === "admin" ? "customer" : "admin";
    try {
      await adminApi.toggleUserRole(customerId, nextRole);
      setCustomers((prev) =>
        prev.map((c) => (c._id === customerId ? { ...c, role: nextRole } : c))
      );
      setActionMessage(`Customer role updated to ${nextRole} ✅`);
      setTimeout(() => setActionMessage(""), 3000);
    } catch (err) {
      setActionMessage(`Role update failed: ${err.message}`);
    }
  };

  // Create Product with Cloudinary Handler
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setUploadingProduct(true);
    setActionMessage("");

    try {
      const formData = new FormData();
      formData.append("name", productForm.name);
      formData.append("category", productForm.category);
      formData.append("price", productForm.price);
      formData.append("originalPrice", productForm.originalPrice || 0);
      formData.append("description", productForm.description);
      formData.append("tag", productForm.tag);
      formData.append("isFeatured", productForm.isFeatured);

      const parsedColors = productForm.colors.split(",").map((c) => ({
        name: c.trim(),
        hex: "#0a0a0a"
      }));
      formData.append("colors", JSON.stringify(parsedColors));

      const parsedSizes = productForm.sizes.split(",").map((s) => s.trim());
      formData.append("sizes", JSON.stringify(parsedSizes));

      if (productImageFile) {
        formData.append("image", productImageFile);
      }

      const res = await productApi.createProduct(formData);
      if (res.success && res.data?.product) {
        setProducts((prev) => [res.data.product, ...prev]);
        setIsProductModalOpen(false);
        setProductForm({
          name: "",
          category: "caps",
          price: "",
          originalPrice: "",
          description: "",
          tag: "NEW DROP",
          colors: "Black, White, Navy",
          sizes: "S, M, L, XL",
          isFeatured: true
        });
        setProductImageFile(null);
        setActionMessage("New product created and uploaded to Cloudinary successfully! 🚀");
        setTimeout(() => setActionMessage(""), 4000);
      }
    } catch (err) {
      setActionMessage(`Failed to create product: ${err.message}`);
    } finally {
      setUploadingProduct(false);
    }
  };

  // Filter Orders
  const filteredOrders = orders.filter((o) => {
    const matchesStatus = orderStatusFilter === "all" || o.status === orderStatusFilter;
    const q = orderSearch.toLowerCase();
    const matchesSearch =
      !orderSearch ||
      o.orderNumber?.toLowerCase().includes(q) ||
      o.customer?.name?.toLowerCase().includes(q) ||
      o.customer?.email?.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const getStatusBadgeColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return { bg: "rgba(46, 213, 115, 0.15)", text: "#2ed573", border: "rgba(46, 213, 115, 0.3)" };
      case "processing":
      case "shipped":
        return { bg: "rgba(13, 202, 240, 0.15)", text: "#0dcaf0", border: "rgba(13, 202, 240, 0.3)" };
      case "cancelled":
        return { bg: "rgba(255, 71, 87, 0.15)", text: "#ff4757", border: "rgba(255, 71, 87, 0.3)" };
      default:
        return { bg: "rgba(212, 175, 55, 0.15)", text: "var(--gold)", border: "rgba(212, 175, 55, 0.3)" };
    }
  };

  if (!isLoggedIn || user?.role !== "admin") {
    return (
      <div style={{ minHeight: "80vh", paddingTop: "140px", textAlign: "center" }}>
        <div className="kcttw-container">
          <div className="glass-panel" style={{ maxWidth: "540px", margin: "0 auto", padding: "60px 30px" }}>
            <Shield size={44} color="var(--gold)" style={{ margin: "0 auto 16px" }} />
            <h2 style={{ fontSize: "24px", fontWeight: "900", color: "#fff", marginBottom: "8px" }}>
              Administrator Clearance Required
            </h2>
            <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "24px" }}>
              Your current account does not hold executive administrator privileges. Please sign in with an authorized administrator credential.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <Link to="/login" className="btn-gold-kcttw">Sign In As Admin</Link>
              <Link to="/" className="btn-outline-kcttw">Return Home</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", paddingTop: "100px", paddingBottom: "120px", background: "#050505" }}>
      <div className="kcttw-container">
        {/* =====================================================
            ADMIN HEADER & ACTIONS
        ===================================================== */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
            marginBottom: "36px"
          }}
        >
          <div>
            <div className="badge-gold" style={{ marginBottom: "8px" }}>
              <Shield size={12} /> KCTTW EXECUTIVE COMMAND
            </div>
            <h1 style={{ fontSize: "clamp(26px, 4vw, 38px)", fontWeight: "900", letterSpacing: "-1px", margin: 0, color: "#fff" }}>
              Store Operations Dashboard
            </h1>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
            <button
              onClick={() => setIsProductModalOpen(true)}
              className="btn-gold-kcttw"
              style={{ padding: "10px 20px", fontSize: "12px" }}
            >
              <Plus size={16} /> New Product Drop (Cloudinary)
            </button>

            <button
              onClick={fetchData}
              className="btn-outline-kcttw"
              style={{ padding: "10px 18px", fontSize: "12px" }}
              title="Refresh live data"
            >
              <RefreshCw size={14} /> Refresh
            </button>
          </div>
        </div>

        {/* Global Toast Action Feedback */}
        {actionMessage && (
          <div
            style={{
              padding: "14px 20px",
              borderRadius: "14px",
              background: "rgba(212, 175, 55, 0.12)",
              border: "1px solid var(--gold)",
              color: "#ffffff",
              marginBottom: "28px",
              fontSize: "13px",
              fontWeight: "700"
            }}
          >
            {actionMessage}
          </div>
        )}

        {/* =====================================================
            KPI STAT CARDS
        ===================================================== */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "20px",
            marginBottom: "40px"
          }}
        >
          {/* Revenue */}
          <div className="glass-panel" style={{ padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)", fontSize: "12px", fontWeight: "800", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "12px" }}>
              <span>Gross Settled Revenue</span>
              <TrendingUp size={18} color="var(--gold)" />
            </div>
            <div style={{ fontSize: "28px", fontWeight: "900", color: "var(--gold)" }}>
              ₦{Number(stats?.totalRevenue || 0).toLocaleString("en-NG")}
            </div>
            <span style={{ fontSize: "11px", color: "var(--text-dim)", marginTop: "4px", display: "block" }}>
              From confirmed Korapay & verified transfers
            </span>
          </div>

          {/* Total Orders */}
          <div className="glass-panel" style={{ padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)", fontSize: "12px", fontWeight: "800", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "12px" }}>
              <span>All Orders Placed</span>
              <Package size={18} color="#0dcaf0" />
            </div>
            <div style={{ fontSize: "28px", fontWeight: "900", color: "#ffffff" }}>
              {stats?.totalOrders || orders.length || 0}
            </div>
            <span style={{ fontSize: "11px", color: "var(--text-dim)", marginTop: "4px", display: "block" }}>
              Across all channels
            </span>
          </div>

          {/* Pending Dispatch */}
          <div className="glass-panel" style={{ padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)", fontSize: "12px", fontWeight: "800", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "12px" }}>
              <span>Pending Fulfillment</span>
              <Clock size={18} color="var(--warning)" />
            </div>
            <div style={{ fontSize: "28px", fontWeight: "900", color: "var(--warning)" }}>
              {stats?.pendingOrders || orders.filter((o) => ["Pending", "Processing"].includes(o.status)).length || 0}
            </div>
            <span style={{ fontSize: "11px", color: "var(--text-dim)", marginTop: "4px", display: "block" }}>
              Require packaging & courier dispatch
            </span>
          </div>

          {/* Customers */}
          <div className="glass-panel" style={{ padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)", fontSize: "12px", fontWeight: "800", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "12px" }}>
              <span>Registered VIP Tribe</span>
              <Users size={18} color="#2ed573" />
            </div>
            <div style={{ fontSize: "28px", fontWeight: "900", color: "#ffffff" }}>
              {stats?.totalCustomers || customers.length || 0}
            </div>
            <span style={{ fontSize: "11px", color: "var(--text-dim)", marginTop: "4px", display: "block" }}>
              Registered accounts in database
            </span>
          </div>
        </div>

        {/* =====================================================
            NAVIGATION TABS
        ===================================================== */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            paddingBottom: "16px",
            marginBottom: "30px",
            overflowX: "auto"
          }}
        >
          <button
            onClick={() => setActiveTab("orders")}
            style={{
              padding: "10px 22px",
              borderRadius: "12px",
              background: activeTab === "orders" ? "#ffffff" : "transparent",
              color: activeTab === "orders" ? "#000000" : "#ffffff",
              border: "none",
              fontSize: "13px",
              fontWeight: "800",
              letterSpacing: "0.5px"
            }}
          >
            Live Orders ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab("customers")}
            style={{
              padding: "10px 22px",
              borderRadius: "12px",
              background: activeTab === "customers" ? "#ffffff" : "transparent",
              color: activeTab === "customers" ? "#000000" : "#ffffff",
              border: "none",
              fontSize: "13px",
              fontWeight: "800",
              letterSpacing: "0.5px"
            }}
          >
            Customer Directory ({customers.length})
          </button>

          <button
            onClick={() => setActiveTab("products")}
            style={{
              padding: "10px 22px",
              borderRadius: "12px",
              background: activeTab === "products" ? "#ffffff" : "transparent",
              color: activeTab === "products" ? "#000000" : "#ffffff",
              border: "none",
              fontSize: "13px",
              fontWeight: "800",
              letterSpacing: "0.5px"
            }}
          >
            Product Catalog ({products.length})
          </button>
        </div>

        {/* =====================================================
            TAB 1: ORDERS TABLE
        ===================================================== */}
        {activeTab === "orders" && (
          <div className="glass-panel" style={{ padding: "24px" }}>
            {/* Search & Filter Bar */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                gap: "16px",
                marginBottom: "24px"
              }}
            >
              <div style={{ position: "relative", minWidth: "260px", flexGrow: 1, maxWidth: "400px" }}>
                <Search
                  size={16}
                  style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "var(--text-dim)" }}
                />
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Search by order #, name or email..."
                  className="kcttw-input"
                  style={{ height: "46px", paddingLeft: "44px" }}
                />
              </div>

              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "700" }}>Status:</span>
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="kcttw-input"
                  style={{ height: "46px", width: "auto" }}
                >
                  <option value="all" style={{ background: "#111" }}>All Statuses</option>
                  <option value="Pending" style={{ background: "#111" }}>Pending</option>
                  <option value="Processing" style={{ background: "#111" }}>Processing</option>
                  <option value="Shipped" style={{ background: "#111" }}>Shipped</option>
                  <option value="Delivered" style={{ background: "#111" }}>Delivered</option>
                  <option value="Cancelled" style={{ background: "#111" }}>Cancelled</option>
                </select>
              </div>
            </div>

            {/* Orders Table */}
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", color: "var(--text-muted)" }}>
                    <th style={{ padding: "14px 12px" }}>Order</th>
                    <th style={{ padding: "14px 12px" }}>Customer</th>
                    <th style={{ padding: "14px 12px" }}>Items</th>
                    <th style={{ padding: "14px 12px" }}>Total</th>
                    <th style={{ padding: "14px 12px" }}>Payment</th>
                    <th style={{ padding: "14px 12px" }}>Fulfillment Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)", fontSize: "14px" }}>
                        No matching orders found.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => {
                      const badge = getStatusBadgeColor(order.status);
                      return (
                        <tr key={order._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: "13px" }}>
                          {/* Order Reference */}
                          <td style={{ padding: "16px 12px" }}>
                            <strong style={{ color: "#ffffff", display: "block" }}>#{order.orderNumber}</strong>
                            <span style={{ fontSize: "11px", color: "var(--text-dim)" }}>
                              {new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                            </span>
                          </td>

                          {/* Customer */}
                          <td style={{ padding: "16px 12px" }}>
                            <div style={{ fontWeight: "700", color: "#fff" }}>{order.customer?.name || "Guest"}</div>
                            <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{order.customer?.email}</div>
                            <div style={{ fontSize: "11px", color: "var(--text-dim)" }}>{order.customer?.phone}</div>
                          </td>

                          {/* Items */}
                          <td style={{ padding: "16px 12px" }}>
                            <div style={{ fontSize: "12px", color: "#fff" }}>
                              {order.items?.map((it, idx) => (
                                <div key={idx} style={{ marginBottom: "2px" }}>
                                  {it.name} ({it.color}, {it.size}) ×<strong>{it.quantity}</strong>
                                </div>
                              ))}
                            </div>
                          </td>

                          {/* Total */}
                          <td style={{ padding: "16px 12px", fontWeight: "900", color: "var(--gold)" }}>
                            ₦{Number(order.total || 0).toLocaleString("en-NG")}
                          </td>

                          {/* Payment */}
                          <td style={{ padding: "16px 12px" }}>
                            <span
                              style={{
                                display: "inline-block",
                                padding: "4px 8px",
                                borderRadius: "6px",
                                fontSize: "10px",
                                fontWeight: "800",
                                background: order.paymentStatus === "Paid" ? "rgba(46,213,115,0.15)" : "rgba(255,165,2,0.15)",
                                color: order.paymentStatus === "Paid" ? "#2ed573" : "var(--warning)",
                                textTransform: "uppercase"
                              }}
                            >
                              {order.paymentMethod} • {order.paymentStatus || "Pending"}
                            </span>
                          </td>

                          {/* Fulfillment Status Selector */}
                          <td style={{ padding: "16px 12px" }}>
                            <select
                              value={order.status}
                              disabled={updatingOrderId === order._id}
                              onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                              style={{
                                padding: "6px 12px",
                                borderRadius: "8px",
                                background: badge.bg,
                                color: badge.text,
                                border: `1px solid ${badge.border}`,
                                fontSize: "12px",
                                fontWeight: "800",
                                cursor: "pointer"
                              }}
                            >
                              <option value="Pending" style={{ background: "#111", color: "#fff" }}>Pending</option>
                              <option value="Processing" style={{ background: "#111", color: "#fff" }}>Processing</option>
                              <option value="Shipped" style={{ background: "#111", color: "#fff" }}>Shipped</option>
                              <option value="Delivered" style={{ background: "#111", color: "#fff" }}>Delivered</option>
                              <option value="Cancelled" style={{ background: "#111", color: "#fff" }}>Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =====================================================
            TAB 2: CUSTOMERS TABLE
        ===================================================== */}
        {activeTab === "customers" && (
          <div className="glass-panel" style={{ padding: "24px" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", color: "var(--text-muted)" }}>
                    <th style={{ padding: "14px 12px" }}>Name</th>
                    <th style={{ padding: "14px 12px" }}>Contact</th>
                    <th style={{ padding: "14px 12px" }}>Role</th>
                    <th style={{ padding: "14px 12px" }}>Total Orders</th>
                    <th style={{ padding: "14px 12px" }}>Total Spent</th>
                    <th style={{ padding: "14px 12px" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c) => (
                    <tr key={c._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: "13px" }}>
                      <td style={{ padding: "16px 12px" }}>
                        <strong style={{ color: "#fff" }}>{c.fullName}</strong>
                        <div style={{ fontSize: "11px", color: "var(--text-dim)" }}>
                          Joined {new Date(c.createdAt).toLocaleDateString()}
                        </div>
                      </td>

                      <td style={{ padding: "16px 12px" }}>
                        <div style={{ color: "#fff" }}>{c.email}</div>
                        <div style={{ fontSize: "11px", color: "var(--text-dim)" }}>{c.phone || "No phone"}</div>
                      </td>

                      <td style={{ padding: "16px 12px" }}>
                        <span className="badge-gold" style={{ fontSize: "9px" }}>
                          {c.role?.toUpperCase()}
                        </span>
                      </td>

                      <td style={{ padding: "16px 12px", fontWeight: "700" }}>
                        {c.totalOrders || 0} orders
                      </td>

                      <td style={{ padding: "16px 12px", fontWeight: "900", color: "var(--gold)" }}>
                        ₦{Number(c.totalSpent || 0).toLocaleString("en-NG")}
                      </td>

                      <td style={{ padding: "16px 12px" }}>
                        <button
                          onClick={() => handleToggleRole(c._id, c.role)}
                          style={{
                            padding: "6px 12px",
                            borderRadius: "8px",
                            background: "rgba(255, 255, 255, 0.08)",
                            border: "1px solid rgba(255, 255, 255, 0.15)",
                            color: "#fff",
                            fontSize: "11px",
                            fontWeight: "700"
                          }}
                        >
                          {c.role === "admin" ? "Demote to Customer" : "Promote to Admin"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =====================================================
            TAB 3: PRODUCT INVENTORY
        ===================================================== */}
        {activeTab === "products" && (
          <div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "24px"
              }}
            >
              {products.map((p) => (
                <div key={p.id || p._id} className="glass-panel" style={{ padding: "20px", display: "flex", flexDirection: "column" }}>
                  <div style={{ width: "100%", height: "180px", background: "rgba(255,255,255,0.04)", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
                    <img src={p.image} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "contain", padding: "10px" }} />
                  </div>
                  <span style={{ fontSize: "10px", color: "var(--gold)", fontWeight: "800", textTransform: "uppercase" }}>{p.categoryName || p.category}</span>
                  <h4 style={{ fontSize: "15px", fontWeight: "800", color: "#fff", margin: "4px 0 8px" }}>{p.name}</h4>
                  <div style={{ fontSize: "16px", fontWeight: "900", color: "var(--gold)", marginBottom: "10px" }}>
                    ₦{Number(p.price).toLocaleString("en-NG")}
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "auto" }}>
                    Tag: <strong>{p.tag || "DROP"}</strong> • In Stock: <strong style={{ color: "#2ed573" }}>Yes</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* =====================================================
          NEW PRODUCT MODAL (WITH CLOUDINARY UPLOAD)
      ===================================================== */}
      {isProductModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 3000,
            background: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(14px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px"
          }}
          onClick={() => setIsProductModalOpen(false)}
        >
          <div
            className="glass-panel"
            style={{
              width: "100%",
              maxWidth: "650px",
              background: "#0e0e0e",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "24px",
              padding: "36px",
              maxHeight: "90vh",
              overflowY: "auto",
              position: "relative"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsProductModalOpen(false)}
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                background: "rgba(255,255,255,0.1)",
                border: "none",
                borderRadius: "50%",
                width: "36px",
                height: "36px",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <X size={18} />
            </button>

            <div className="badge-gold" style={{ marginBottom: "8px" }}>
              <Upload size={12} /> CLOUDINARY MEDIA MANAGER
            </div>
            <h2 style={{ fontSize: "24px", fontWeight: "900", color: "#fff", marginBottom: "20px" }}>
              Launch New Apparel Drop
            </h2>

            <form onSubmit={handleCreateProduct} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: "800", textTransform: "uppercase", marginBottom: "6px", color: "var(--text-muted)" }}>
                  Product Name *
                </label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="e.g. KCTTW Monogram Silk Scarf"
                  required
                  className="kcttw-input"
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: "800", textTransform: "uppercase", marginBottom: "6px", color: "var(--text-muted)" }}>
                    Category *
                  </label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="kcttw-input"
                  >
                    <option value="caps" style={{ background: "#111" }}>Signature Caps</option>
                    <option value="shirts" style={{ background: "#111" }}>Collared Shirts</option>
                    <option value="round-necks" style={{ background: "#111" }}>Round Necks</option>
                    <option value="accessories" style={{ background: "#111" }}>Accessories</option>
                    <option value="limited-drops" style={{ background: "#111" }}>Limited Drops</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: "800", textTransform: "uppercase", marginBottom: "6px", color: "var(--text-muted)" }}>
                    Price (₦) *
                  </label>
                  <input
                    type="number"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    placeholder="25000"
                    required
                    className="kcttw-input"
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: "800", textTransform: "uppercase", marginBottom: "6px", color: "var(--text-muted)" }}>
                  Upload Product Image to Cloudinary *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProductImageFile(e.target.files[0])}
                  className="kcttw-input"
                  style={{ padding: "12px" }}
                />
                <span style={{ fontSize: "11px", color: "var(--text-dim)", marginTop: "4px", display: "block" }}>
                  PNG / JPG with transparent or clean background recommended.
                </span>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: "800", textTransform: "uppercase", marginBottom: "6px", color: "var(--text-muted)" }}>
                  Description *
                </label>
                <textarea
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Tailoring specifications, fabric weight, craftsmanship details..."
                  rows={3}
                  required
                  className="kcttw-input"
                  style={{ height: "auto", padding: "12px", resize: "vertical" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: "800", textTransform: "uppercase", marginBottom: "6px", color: "var(--text-muted)" }}>
                    Colors (comma separated)
                  </label>
                  <input
                    type="text"
                    value={productForm.colors}
                    onChange={(e) => setProductForm({ ...productForm, colors: e.target.value })}
                    placeholder="Black, Navy, White"
                    className="kcttw-input"
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: "800", textTransform: "uppercase", marginBottom: "6px", color: "var(--text-muted)" }}>
                    Badge Tag
                  </label>
                  <input
                    type="text"
                    value={productForm.tag}
                    onChange={(e) => setProductForm({ ...productForm, tag: e.target.value })}
                    placeholder="EXCLUSIVE DROP"
                    className="kcttw-input"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={uploadingProduct}
                className="btn-gold-kcttw"
                style={{ width: "100%", height: "52px", marginTop: "12px" }}
              >
                {uploadingProduct ? (
                  <span>UPLOADING TO CLOUDINARY...</span>
                ) : (
                  <>
                    <Upload size={16} />
                    <span>PUBLISH DROP TO STORE</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
