// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

// Attach the saved JWT (if any) to every outgoing request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("dernsupport_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
