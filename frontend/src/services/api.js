import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

// Request interceptor to attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("kcttw_token") || sessionStorage.getItem("kcttw_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for clean error handling
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "An error occurred while connecting to the server.";
    const customError = new Error(message);
    customError.status = error.response?.status;
    customError.data = error.response?.data;
    return Promise.reject(customError);
  }
);

/* =========================================================
   AUTH API
========================================================= */
export const authApi = {
  login: (email, password) => apiClient.post("/auth/login", { email, password }),
  register: (userData) => apiClient.post("/auth/register", userData),
  getMe: () => apiClient.get("/auth/me"),
  updateProfile: (profileData) => apiClient.put("/auth/profile", profileData),
  changePassword: (passwords) => apiClient.put("/auth/change-password", passwords)
};

/* =========================================================
   ORDERS API
========================================================= */
export const orderApi = {
  createOrder: (orderData) => apiClient.post("/orders", orderData),
  getMyOrders: () => apiClient.get("/orders/my-orders"),
  getOrderById: (id) => apiClient.get(`/orders/${id}`)
};

/* =========================================================
   KORAPAY PAYMENT API
========================================================= */
export const paymentApi = {
  initializeKorapay: (orderId, redirectUrl) =>
    apiClient.post("/payments/korapay/initialize", { orderId, redirectUrl }),
  verifyKorapay: (reference, orderId) =>
    apiClient.get(`/payments/korapay/verify/${reference}`, {
      params: { order_id: orderId }
    })
};

/* =========================================================
   CONTACT API
========================================================= */
export const contactApi = {
  sendMessage: (data) => apiClient.post("/contact", data)
};

export default apiClient;
