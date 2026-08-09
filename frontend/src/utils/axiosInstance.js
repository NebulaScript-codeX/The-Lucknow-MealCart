import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:4000/api/v1", // apna backend base URL yahan daalo
  withCredentials: true, // agar cookies/JWT cookie based auth h
});

// Agar token localStorage m rakhte ho to ye interceptor use karo
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
