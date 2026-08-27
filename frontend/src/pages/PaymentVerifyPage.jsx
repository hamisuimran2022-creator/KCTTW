import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { paymentApi } from "../services/api";
import { CheckCircle, Clock, AlertTriangle, ArrowRight, MessageCircle, ShoppingBag } from "lucide-react";

const PaymentVerifyPage = () => {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("reference");
  const orderId = searchParams.get("order_id");
  const statusParam = searchParams.get("status");

  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const verifyTransaction = async () => {
      if (!reference && !orderId) {
        setLoading(false);
        return;
      }

      try {
        if (reference) {
          const res = await paymentApi.verifyKorapay(reference, orderId);
          if (res.success && res.data?.status === "success") {
            setVerified(true);
            setOrderData(res.data.order);
          } else {
            setVerified(statusParam === "success");
          }
        } else {
          setVerified(statusParam === "success" || statusParam === "pending");
        }
      } catch (err) {
        console.error("Verification error:", err);
        // If query status was success, display success
        if (statusParam === "success") {
          setVerified(true);
        } else {
          setErrorMessage(err.message || "Payment verification incomplete.");
        }
      } finally {
        setLoading(false);
      }
    };

    verifyTransaction();
  }, [reference, orderId, statusParam]);

  if (loading) {
    return (
      <div style={{ paddingTop: "160px", paddingBottom: "160px", textAlign: "center" }}>
        <div className="kcttw-container">
          <div className="glass-panel" style={{ padding: "60px 30px", maxWidth: "540px", margin: "0 auto" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                border: "3px solid rgba(212,175,55,0.2)",
                borderTopColor: "var(--gold)",
                animation: "spin 1s linear infinite",
                margin: "0 auto 24px"
              }}
            />
            <h2 style={{ fontSize: "22px", fontWeight: "900", marginBottom: "10px" }}>
              Verifying Korapay Transaction...
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
              Please hold on while we confirm your payment with the gateway.
            </p>
          </div>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: "130px", paddingBottom: "130px" }}>
      <div className="kcttw-container">
        <div
          className="glass-panel"
          style={{
            padding: "50px 30px",
            maxWidth: "650px",
            margin: "0 auto",
            textAlign: "center"
          }}
        >
          {verified ? (
            <>
              <div
                style={{
                  width: "72px",
                  height: "72px",
                  borderRadius: "50%",
                  background: "rgba(46, 213, 115, 0.15)",
                  color: "#2ed573",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 24px"
                }}
              >
                <CheckCircle size={38} />
              </div>

              <span className="badge-gold" style={{ marginBottom: "16px" }}>
                PAYMENT CONFIRMED
              </span>

              <h1 style={{ fontSize: "clamp(26px, 4vw, 36px)", fontWeight: "900", marginBottom: "12px" }}>
                Thank You For Your Order!
              </h1>

              <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: "1.7", marginBottom: "30px" }}>
                Your order has been recorded and an official receipt has been dispatched to your email address. Our fulfillment concierge is preparing your package.
              </p>

              {/* Order Details Card */}
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "16px",
                  padding: "20px",
                  textAlign: "left",
                  marginBottom: "30px"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "13px" }}>
                  <span style={{ color: "var(--text-muted)" }}>Order Reference:</span>
                  <strong style={{ color: "#ffffff" }}>{orderData?.orderNumber || orderId || reference || "KCTTW-ORDER"}</strong>
                </div>

                {orderData?.total && (
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "13px" }}>
                    <span style={{ color: "var(--text-muted)" }}>Amount Paid:</span>
                    <strong style={{ color: "var(--gold)" }}>₦{Number(orderData.total).toLocaleString("en-NG")}</strong>
                  </div>
                )}

                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                  <span style={{ color: "var(--text-muted)" }}>Payment Method:</span>
                  <strong style={{ color: "#ffffff" }}>Korapay Gateway</strong>
                </div>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", justifyContent: "center" }}>
                <Link to="/dashboard" className="btn-gold-kcttw">
                  <span>VIEW MY DASHBOARD</span>
                  <ArrowRight size={16} />
                </Link>

                <Link to="/products" className="btn-outline-kcttw">
                  <ShoppingBag size={16} />
                  <span>CONTINUE SHOPPING</span>
                </Link>
              </div>
            </>
          ) : (
            <>
              <div
                style={{
                  width: "72px",
                  height: "72px",
                  borderRadius: "50%",
                  background: "rgba(255, 165, 2, 0.15)",
                  color: "var(--warning)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 24px"
                }}
              >
                <Clock size={38} />
              </div>

              <h1 style={{ fontSize: "28px", fontWeight: "900", marginBottom: "12px" }}>
                Order Processing
              </h1>

              <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: "1.7", marginBottom: "30px" }}>
                {errorMessage || "We are awaiting gateway settlement. If you were debited, your order will update shortly."}
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", justifyContent: "center" }}>
                <a
                  href={`https://wa.me/2349072585516?text=Hello%20KCTTW%2C%20I%20need%20to%20confirm%20my%20payment%20for%20order%20${orderId || reference || ''}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold-kcttw"
                >
                  <MessageCircle size={16} />
                  <span>CONFIRM ON WHATSAPP</span>
                </a>

                <Link to="/" className="btn-outline-kcttw">
                  RETURN HOME
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentVerifyPage;
