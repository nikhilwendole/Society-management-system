import api from "./api";

export const login = (email, password) => api.post("/auth/login", { email, password });

export const register = (data) => api.post("/auth/register", data);

export const getMe = () => api.get("/auth/me");

export const forgotPassword = (email) => api.post("/auth/forgot-password", { email });

export const resetPassword = (token, password) =>
  api.put(`/auth/reset-password/${token}`, { password });
