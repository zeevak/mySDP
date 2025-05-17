// src/services/investmentService.js

import api from "./api";

export const investmentService = {
    getInvestmentOptions: async () => {
        return api.get("/investments");
    },
    
    getInvestmentById: async (id) => {
        return api.get(`/investments/${id}`);
    },
    
    makeInvestment: async (investmentData) => {
        return api.post("/investments", investmentData);
    }
};
