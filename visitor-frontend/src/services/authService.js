/* eslint-disable no-useless-catch */
// src/services/authService.js

import api from "./api";

export const authService = {
    login: async (email, password) => {
        try {
            const response = await api.post("/customer/login", { email, password });
            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
            }
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    
    logout: () => {
        localStorage.removeItem("token");
    },
    
    register: async (userData) => {
        return api.post("/auth/register", userData);
    },
    
    forgotPassword: async (email) => {
        return api.post("/auth/forgot-password", { email });
    },
    
    resetPassword: async (token, newPassword) => {
        return api.post("/auth/reset-password", { token, newPassword });
    },
    
    getCurrentUser: async () => {
        return api.get("/auth/me");
    }
};
