import React from "react";
import { useCart } from "../context/CartContext";
import { CheckCircle, Info, AlertTriangle } from "lucide-react";

const ToastNotification = () => {
  const { toast } = useCart();

  if (!toast.show) return null;

  const icons = {
    success: <CheckCircle size={18} color="#2ed573" />,
    info: <Info size={18} color="#0dcaf0" />,
    warning: <AlertTriangle size={18} color="#ffc107" />
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "30px",
        right: "30px",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "16px 24px",
        borderRadius: "16px",
        background: "rgba(18, 18, 18, 0.95)",
        border: "1px solid rgba(255, 255, 255, 0.15)",
        color: "#ffffff",
        boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        fontSize: "13px",
        fontWeight: "700",
        animation: "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
      }}
    >
      {icons[toast.type] || icons.success}
      <span>{toast.message}</span>
    </div>
  );
};

export default ToastNotification;
