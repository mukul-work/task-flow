import axios from "axios";

// Axios instance — relative URLs work for Next.js same-origin API routes
const api = axios.create({
  headers: { "Content-Type": "application/json" },
});

// Attach error message from response if available
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.error || err.message || "Unknown error";
    return Promise.reject(new Error(message));
  },
);

export default api;
