import React, { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // App load hote hi check karo ki cookie se user already logged in hai kya
  const fetchMe = async () => {
    try {
      const res = await axiosInstance.get("/auth/me");
      setUser(res.data?.data || null);
    } catch (err) {
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      setUser(res.data?.data || null);

      return {
        success: true,
        message: res.data?.message,
      };
    } catch (err) {
      return {
        success: false,
        message:
          err.response?.data?.message ||
          "Login failed. Please check your credentials.",
      };
    }
  };

  const register = async (payload) => {
    try {
      const res = await axiosInstance.post("/auth/register", payload);
      return {
        success: true,
        message: res.data?.message,
        data: res.data?.data,
      };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Register fail ho gaya.",
      };
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.get("/auth/logout");
    } catch (err) {
      console.error(err);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, authLoading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
