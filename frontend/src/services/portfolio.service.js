import api from "./api";

const generatePortfolio = (resumeId) => {
    return api.post(`/portfolio/generate/${resumeId}`);
};

const getMyPortfolio = () => {
    return api.get("/portfolio/me");
};

const updatePortfolio = (data) => {
    return api.put("/portfolio/me", data);
};

const getPublicPortfolio = (username) => {
    return api.get(`/portfolio/p/${username}`);
};

const PortfolioService = {
    generatePortfolio,
    getMyPortfolio,
    updatePortfolio,
    getPublicPortfolio,
};

export default PortfolioService;
