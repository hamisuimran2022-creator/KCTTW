import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { orderApi, paymentApi } from "../services/api";
import { CreditCard, Truck, ShieldCheck, ArrowRight, MessageCircle, AlertCircle } from "lucide-react";

const CheckoutPage = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.fullName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    street: user?.address?.street || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "Lagos",
    notes: ""
  });

  const [paymentMethod, setPaymentMethod] = useState("korapay");
  const [shippingFee, setShippingFee] = useState(2500); // Standard flat shipping fee in ₦
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const totalAmount = cartTotal + shippingFee;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStateChange = (e) => {
    const selectedState = e.target.value;
    setFormData({ ...formData, state: selectedState });
    setShippingFee(selectedState === "Lagos" ? 2500 : 4000);
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (cart.length === 0) {
      setErrorMessage("Your bag is empty. Please add items before checking out.");
      return;
    }

    if (!formData.name || !formData.email || !formData.phone || !formData.street || !formData.city) {
      setErrorMessage("Please complete all required customer and shipping address fields.");
      return;
    }

    setLoading(true);

    try {
      // 1. Create order on the backend API
      const orderPayload = {
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        },
        items: cart.map((item) => ({
          productId: item.productId || item.id,
          name: item.name,
          color: item.color,
          size: item.size,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        shippingAddress: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          country: "Nigeria"
        },
        paymentMethod,
        notes: formData.notes
      };

      const orderResponse = await orderApi.createOrder(orderPayload);
      const createdOrder = orderResponse.data?.order;

      if (!createdOrder) {
        throw new Error("Failed to register your order. Please try again.");
      }

      // 2. Handle Payment Flow based on method
      if (paymentMethod === "korapay") {
        // Initialize Korapay Gateway
        const redirectUrl = `${window.location.origin}/payment/verify`;
        const paymentRes = await paymentApi.initializeKorapay(createdOrder.orderNumber, redirectUrl);

        if (paymentRes.success && paymentRes.data?.checkout_url) {
          clearCart();
          // Redirect to Korapay Checkout
          window.location.href = paymentRes.data.checkout_url;
          return;
        } else {
          throw new Error(paymentRes.message || "Failed to launch Korapay payment gateway.");
        }
      } else if (paymentMethod === "whatsapp") {
        clearCart();
        const whatsappMsg = `Hello KCTTW 👋 I just placed Order #${createdOrder.orderNumber} for total ₦${totalAmount.toLocaleString("en-NG")}.\nName: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nDelivery: ${formData.street}, ${formData.city}, ${formData.state}`;
        window.open(`https://wa.me/2349072585516?text=${encodeURIComponent(whatsappMsg)}`, "_blank");
        navigate(`/payment/verify?order_id=${createdOrder.orderNumber}&status=pending`);
      } else {
        // Bank transfer / other methods
        clearCart();
        navigate(`/payment/verify?order_id=${createdOrder.orderNumber}&status=pending`);
      }
    } catch (err) {
      console.error("Order processing failed:", err);
      setErrorMessage(err.message || "An error occurred while placing your order.");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div style={{ paddingTop: "140px", paddingBottom: "140px", textAlign: "center" }}>
        <div className="kcttw-container">
          <div className="glass-panel" style={{ padding: "60px 30px", maxWidth: "500px", margin: "0 auto" }}>
            <h2 style={{ fontSize: "24px", fontWeight: "900", marginBottom: "16px" }}>Your Bag is Empty</h2>
            <p style={{ color: "var(--text-muted)", marginBottom: "24px" }}>Add items to your bag before proceeding to checkout.</p>
            <Link to="/products" className="btn-gold-kcttw">Browse Drops</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: "120px", paddingBottom: "120px" }}>
      <div className="kcttw-container">
        {/* Header */}
        <div style={{ marginBottom: "40px" }}>
          <span style={{ fontSize: "11px", letterSpacing: "3px", fontWeight: "800", color: "var(--gold)", textTransform: "uppercase" }}>
            SECURE CHECKOUT
          </span>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: "900", letterSpacing: "-1px", marginTop: "6px" }}>
            Delivery & Payment
          </h1>
        </div>

        {errorMessage && (
          <div
            style={{
              padding: "16px 20px",
              borderRadius: "14px",
              background: "rgba(255, 71, 87, 0.15)",
              border: "1px solid var(--danger)",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "30px",
              fontSize: "14px",
              fontWeight: "600"
            }}
          >
            <AlertCircle size={20} color="var(--danger)" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmitOrder}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "40px",
              alignItems: "flex-start"
            }}
          >
            {/* Left: Customer & Address Details */}
            <div style={{ display: "flex", flexDirection: "column", gap: "30px", gridColumn: "span 2" }}>
              {/* Customer Contact */}
              <div className="glass-panel" style={{ padding: "30px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "800", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                  <ShieldCheck size={18} color="var(--gold)" />
                  1. Customer Information
                </h3>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "700", marginBottom: "6px", color: "var(--text-muted)" }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. John Doe"
                      required
                      className="kcttw-input"
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "700", marginBottom: "6px", color: "var(--text-muted)" }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      required
                      className="kcttw-input"
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "700", marginBottom: "6px", color: "var(--text-muted)" }}>
                      Phone / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+234 800 000 0000"
                      required
                      className="kcttw-input"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="glass-panel" style={{ padding: "30px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "800", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                  <Truck size={18} color="var(--gold)" />
                  2. Shipping Destination
                </h3>

                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "700", marginBottom: "6px", color: "var(--text-muted)" }}>
                      Street Address / House Number *
                    </label>
                    <input
                      type="text"
                      name="street"
                      value={formData.street}
                      onChange={handleChange}
                      placeholder="12 Admiralty Way, Lekki Phase 1"
                      required
                      className="kcttw-input"
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: "700", marginBottom: "6px", color: "var(--text-muted)" }}>
                        City / Town *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Lekki"
                        required
                        className="kcttw-input"
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: "700", marginBottom: "6px", color: "var(--text-muted)" }}>
                        State / Region *
                      </label>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleStateChange}
                        className="kcttw-input"
                        style={{ appearance: "none" }}
                      >
                        <option value="Lagos" style={{ background: "#111" }}>Lagos (₦2,500)</option>
                        <option value="Abuja" style={{ background: "#111" }}>Abuja (₦4,000)</option>
                        <option value="Rivers" style={{ background: "#111" }}>Port Harcourt / Rivers (₦4,000)</option>
                        <option value="Oyo" style={{ background: "#111" }}>Ibadan / Oyo (₦4,000)</option>
                        <option value="Kano" style={{ background: "#111" }}>Kano (₦4,000)</option>
                        <option value="Other" style={{ background: "#111" }}>Other Nationwide (₦4,000)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "700", marginBottom: "6px", color: "var(--text-muted)" }}>
                      Special Delivery Instructions (Optional)
                    </label>
                    <input
                      type="text"
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="Leave with concierge, call upon arrival, etc."
                      className="kcttw-input"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="glass-panel" style={{ padding: "30px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "800", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                  <CreditCard size={18} color="var(--gold)" />
                  3. Select Payment Gateway
                </h3>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px" }}>
                  {/* Korapay Gateway */}
                  <label
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      padding: "18px",
                      borderRadius: "16px",
                      background: paymentMethod === "korapay" ? "rgba(212, 175, 55, 0.12)" : "rgba(255, 255, 255, 0.03)",
                      border: paymentMethod === "korapay" ? "2px solid var(--gold)" : "1px solid rgba(255, 255, 255, 0.1)",
                      cursor: "pointer",
                      transition: "all 0.2s"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                      <span style={{ fontSize: "14px", fontWeight: "800", color: "#ffffff" }}>Korapay</span>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="korapay"
                        checked={paymentMethod === "korapay"}
                        onChange={() => setPaymentMethod("korapay")}
                      />
                    </div>
                    <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                      Cards, Bank Transfer, USSD & Virtual Accounts
                    </span>
                    <span className="badge-gold" style={{ marginTop: "10px", width: "fit-content", fontSize: "9px" }}>
                      RECOMMENDED
                    </span>
                  </label>

                  {/* Paystack Gateway */}
                  <label
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      padding: "18px",
                      borderRadius: "16px",
                      background: paymentMethod === "paystack" ? "rgba(212, 175, 55, 0.12)" : "rgba(255, 255, 255, 0.03)",
                      border: paymentMethod === "paystack" ? "2px solid var(--gold)" : "1px solid rgba(255, 255, 255, 0.1)",
                      cursor: "pointer",
                      transition: "all 0.2s"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                      <span style={{ fontSize: "14px", fontWeight: "800", color: "#ffffff" }}>Paystack</span>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="paystack"
                        checked={paymentMethod === "paystack"}
                        onChange={() => setPaymentMethod("paystack")}
                      />
                    </div>
                    <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                      Debit / Credit Card & Bank Transfers
                    </span>
                  </label>

                  {/* WhatsApp VIP Concierge */}
                  <label
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      padding: "18px",
                      borderRadius: "16px",
                      background: paymentMethod === "whatsapp" ? "rgba(46, 213, 115, 0.12)" : "rgba(255, 255, 255, 0.03)",
                      border: paymentMethod === "whatsapp" ? "2px solid #2ed573" : "1px solid rgba(255, 255, 255, 0.1)",
                      cursor: "pointer",
                      transition: "all 0.2s"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                      <span style={{ fontSize: "14px", fontWeight: "800", color: "#ffffff" }}>WhatsApp VIP</span>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="whatsapp"
                        checked={paymentMethod === "whatsapp"}
                        onChange={() => setPaymentMethod("whatsapp")}
                      />
                    </div>
                    <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                      Manual confirmation & direct account details
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Right: Order Summary Sidebar */}
            <div className="glass-panel" style={{ padding: "30px", position: "sticky", top: "110px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "900", marginBottom: "20px" }}>
                Bag Summary
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "240px", overflowY: "auto", marginBottom: "20px" }}>
                {cart.map((item) => (
                  <div key={item.cartItemId} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "13px" }}>
                    <div>
                      <strong style={{ color: "#ffffff" }}>{item.name}</strong>
                      <div style={{ fontSize: "11px", color: "var(--text-dim)" }}>
                        {item.color} • {item.size} (x{item.quantity})
                      </div>
                    </div>
                    <span style={{ fontWeight: "700" }}>
                      ₦{(item.price * item.quantity).toLocaleString("en-NG")}
                    </span>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.1)", paddingTop: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "var(--text-muted)" }}>
                  <span>Subtotal</span>
                  <strong style={{ color: "#ffffff" }}>₦{cartTotal.toLocaleString("en-NG")}</strong>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "var(--text-muted)" }}>
                  <span>Shipping ({formData.state})</span>
                  <strong style={{ color: "#ffffff" }}>₦{shippingFee.toLocaleString("en-NG")}</strong>
                </div>

                <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.1)", paddingTop: "14px", display: "flex", justifyContent: "space-between", fontSize: "18px", fontWeight: "900" }}>
                  <span>Total Due</span>
                  <span style={{ color: "var(--gold)" }}>₦{totalAmount.toLocaleString("en-NG")}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-gold-kcttw"
                style={{ width: "100%", height: "54px", marginTop: "24px" }}
              >
                {loading ? (
                  <span>CONNECTING GATEWAY...</span>
                ) : (
                  <>
                    <span>PAY WITH {paymentMethod.toUpperCase()}</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              <div style={{ textAlign: "center", marginTop: "16px", fontSize: "11px", color: "var(--text-dim)" }}>
                🔒 256-bit encrypted checkout with Korapay & Paystack
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
