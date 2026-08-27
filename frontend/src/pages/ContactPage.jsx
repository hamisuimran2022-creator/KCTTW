import React, { useState } from "react";
import { contactApi } from "../services/api";
import { Mail, Phone, MessageCircle, Send, CheckCircle2, Clock, MapPin, ChevronDown } from "lucide-react";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Order Inquiry",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [openFaq, setOpenFaq] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await contactApi.sendMessage(formData);
      setSuccess(true);
      setFormData({ name: "", email: "", phone: "", subject: "Order Inquiry", message: "" });
      setTimeout(() => setSuccess(false), 6000);
    } catch (err) {
      // Fallback to WhatsApp
      const whatsappMsg = `Hello KCTTW 👋\nName: ${formData.name}\nEmail: ${formData.email}\nSubject: ${formData.subject}\n\nMessage:\n${formData.message}`;
      window.open(`https://wa.me/2349072585516?text=${encodeURIComponent(whatsappMsg)}`, "_blank");
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  const faqs = [
    {
      q: "How long does delivery take within Nigeria?",
      a: "Deliveries within Lagos take 24–48 hours. Orders to Abuja, Port Harcourt, and other states typically arrive within 2–4 business days with trackable courier."
    },
    {
      q: "Do you ship internationally?",
      a: "Yes, we ship globally (UK, US, Canada, Europe, Africa) via DHL Express with tracking provided upon dispatch."
    },
    {
      q: "What payment methods are supported on KCTTW?",
      a: "We support Korapay (Cards, Bank Transfer, USSD, Virtual Accounts), Paystack, and direct VIP WhatsApp transfers."
    },
    {
      q: "Can I customize an order or request bulk corporate orders?",
      a: "Yes, for bespoke requests or wholesale collaborations, please reach out to our concierge via WhatsApp."
    }
  ];

  return (
    <div style={{ paddingTop: "120px", paddingBottom: "120px" }}>
      <div className="kcttw-container">
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <span style={{ fontSize: "11px", letterSpacing: "3px", fontWeight: "800", color: "var(--gold)", textTransform: "uppercase" }}>
            24/7 VIP CONCIERGE
          </span>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 54px)", fontWeight: "900", letterSpacing: "-1.5px", marginTop: "8px" }}>
            Get in Touch
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", maxWidth: "540px", margin: "14px auto 0" }}>
            Have a question about a drop, order status, or bespoke styling? Our team is at your service.
          </p>
        </div>

        {/* Layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "50px",
            marginBottom: "80px"
          }}
        >
          {/* Left: Contact Info Channels */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div className="glass-panel" style={{ padding: "30px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "800", marginBottom: "20px" }}>
                Direct Channels
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <a
                  href="https://wa.me/2349072585516"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    padding: "16px",
                    borderRadius: "14px",
                    background: "rgba(46, 213, 115, 0.08)",
                    border: "1px solid rgba(46, 213, 115, 0.2)"
                  }}
                >
                  <MessageCircle size={24} color="#2ed573" />
                  <div>
                    <strong style={{ display: "block", fontSize: "14px", color: "#2ed573" }}>WhatsApp VIP Concierge</strong>
                    <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>+234 907 258 5516 (Instant reply)</span>
                  </div>
                </a>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    padding: "16px",
                    borderRadius: "14px",
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.08)"
                  }}
                >
                  <Mail size={22} color="var(--gold)" />
                  <div>
                    <strong style={{ display: "block", fontSize: "14px", color: "#ffffff" }}>Official Email</strong>
                    <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>support@kcttw.com</span>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    padding: "16px",
                    borderRadius: "14px",
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.08)"
                  }}
                >
                  <Clock size={22} color="var(--gold)" />
                  <div>
                    <strong style={{ display: "block", fontSize: "14px", color: "#ffffff" }}>Operating Hours</strong>
                    <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Mon – Sat: 8:00 AM – 9:00 PM (WAT)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="glass-panel" style={{ padding: "35px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "800", marginBottom: "20px" }}>
              Send Us a Direct Message
            </h3>

            {success && (
              <div
                style={{
                  padding: "16px 20px",
                  borderRadius: "12px",
                  background: "rgba(46, 213, 115, 0.15)",
                  border: "1px solid #2ed573",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "20px",
                  fontSize: "13px",
                  fontWeight: "600"
                }}
              >
                <CheckCircle2 size={20} color="#2ed573" />
                <span>Thank you! Your message has been dispatched to our team.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "700", marginBottom: "6px", color: "var(--text-muted)" }}>
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
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
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "700", marginBottom: "6px", color: "var(--text-muted)" }}>
                  Phone / WhatsApp (Optional)
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+234..."
                  className="kcttw-input"
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "700", marginBottom: "6px", color: "var(--text-muted)" }}>
                  Subject
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="kcttw-input"
                  style={{ appearance: "none" }}
                >
                  <option value="Order Inquiry" style={{ background: "#111" }}>Order Status Inquiry</option>
                  <option value="Product Sizing" style={{ background: "#111" }}>Product Sizing & Fit</option>
                  <option value="Payment Inquiry" style={{ background: "#111" }}>Payment & Invoicing</option>
                  <option value="Wholesale Collaboration" style={{ background: "#111" }}>Wholesale / Partnership</option>
                  <option value="Other" style={{ background: "#111" }}>Other</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "700", marginBottom: "6px", color: "var(--text-muted)" }}>
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder="How can we assist you today?"
                  required
                  className="kcttw-input"
                  style={{ height: "auto", padding: "14px 18px", resize: "vertical" }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-gold-kcttw"
                style={{ width: "100%", height: "50px", marginTop: "10px" }}
              >
                {loading ? <span>SENDING MESSAGE...</span> : <span>SEND MESSAGE</span>}
              </button>
            </form>
          </div>
        </div>

        {/* FAQs */}
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "28px", fontWeight: "900", textAlign: "center", marginBottom: "30px" }}>
            Frequently Asked Questions
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="glass-panel"
                style={{ padding: "20px", cursor: "pointer" }}
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: "800", fontSize: "15px" }}>
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={18}
                    style={{
                      transform: openFaq === idx ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s"
                    }}
                  />
                </div>
                {openFaq === idx && (
                  <p style={{ marginTop: "14px", fontSize: "13px", color: "var(--text-muted)", lineHeight: "1.7", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "12px" }}>
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
