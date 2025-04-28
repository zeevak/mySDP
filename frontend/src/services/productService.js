// src/services/productService.js

import api from "./api";

export const productService = {
    getProducts: async (category) => {
        return api.get(`/products${category ? `?category=${category}` : ''}`);
    },
    
    getProductById: async (id) => {
        return api.get(`/products/${id}`);
    }
};
