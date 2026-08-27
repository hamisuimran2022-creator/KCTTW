import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("kcttwCart");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  useEffect(() => {
    try {
      localStorage.setItem("kcttwCart", JSON.stringify(cart));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [cart]);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3000);
  };

  const addToCart = (product, color = "Black", size = "Standard", quantity = 1) => {
    const qty = Math.max(1, Number(quantity) || 1);
    const cartItemId = `${product.id}-${color}-${size}`;

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += qty;
        return updated;
      } else {
        return [
          ...prevCart,
          {
            cartItemId,
            id: product.id,
            productId: product.id,
            name: product.name,
            price: Number(product.price),
            color: color || "Default",
            size: size || "Standard",
            image: product.image || "/images/cap.png",
            quantity: qty
          }
        ];
      }
    });

    showToast(`${product.name} (${color}) added to your bag 🛒`);
  };

  const updateQuantity = (cartItemId, delta) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.cartItemId === cartItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const removeFromCart = (cartItemId) => {
    setCart((prevCart) => prevCart.filter((item) => item.cartItemId !== cartItemId));
    showToast("Item removed from bag", "info");
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("kcttwCart");
  };

  const cartCount = cart.reduce((total, item) => total + (Number(item.quantity) || 1), 0);
  const cartTotal = cart.reduce((total, item) => total + (Number(item.price) * Number(item.quantity || 1)), 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartTotal,
        toast,
        showToast
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
