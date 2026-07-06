import axios from "axios";

// ✅ Use environment variable for API URL
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

api.interceptors.request.use(
  (config) => {
    console.log(`📤 ${config.method.toUpperCase()} ${config.url}`, config.data);
    return config;
  },
  (error) => {
    console.error("❌ Request error:", error);
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    console.log(`📥 ${response.status} ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error(
        "❌ Response error:",
        error.response.status,
        error.response.data,
      );
    } else if (error.request) {
      console.error("❌ No response received:", error.request);
    } else {
      console.error("❌ Error:", error.message);
    }
    return Promise.reject(error);
  },
);

export const stripeApi = {
  healthCheck: () => api.get("/"),
  createPaymentIntent: (data) => api.post("/create-payment-intent", data),
  confirmPayment: (paymentIntentId) =>
    api.post("/confirm-payment", { paymentIntentId }),
  getPaymentStatus: (paymentIntentId) =>
    api.get(`/payment-status/${paymentIntentId}`),
  getAllPayments: (limit = 10) => api.get(`/payments?limit=${limit}`),
};

export default api;
