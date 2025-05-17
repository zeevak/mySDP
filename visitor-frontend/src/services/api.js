// src/services/api.js

import axios from "axios";
import { BASE_URL, API_TIMEOUT, AUTH_TOKEN_KEY } from "../utils/Constants";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: API_TIMEOUT,
    headers: {
        "Content-Type": "application/json"
    }
});

// Request interceptor for adding auth token
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem(AUTH_TOKEN_KEY);
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for handling common errors
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        
        // Handle 401 Unauthorized errors (token expired)
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
                // You could implement token refresh logic here
                // const refreshToken = localStorage.getItem("refreshToken");
                // const response = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
                // const { token } = response.data;
                // localStorage.setItem(AUTH_TOKEN_KEY, token);
                // originalRequest.headers.Authorization = `Bearer ${token}`;
                // return axios(originalRequest);
                
                // For now, just logout the user
                localStorage.removeItem(AUTH_TOKEN_KEY);
                window.location.href = "/customer-login";
            } catch (refreshError) {
                console.error("Error refreshing token:", refreshError);
                localStorage.removeItem(AUTH_TOKEN_KEY);
                window.location.href = "/customer-login";
                return Promise.reject(refreshError);
            }
        }
        
        return Promise.reject(error);
    }
);

export default axiosInstance;
