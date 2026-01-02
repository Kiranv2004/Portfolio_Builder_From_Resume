import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.token) {
            config.headers['Authorization'] = 'Bearer ' + user.token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalConfig = error.config;

        if (originalConfig.url !== "/auth/login" && error.response) {
            // Access Token was expired
            if (error.response.status === 401 && !originalConfig._retry) {
                originalConfig._retry = true;

                try {
                    // TODO: Implement refresh token logic here if backend supports it
                    // const rs = await api.post("/auth/refreshtoken", {
                    //   refreshToken: TokenService.getLocalRefreshToken(),
                    // });
                    // const { accessToken } = rs.data;
                    // TokenService.updateLocalAccessToken(accessToken);
                    // return api(originalConfig);

                    // For now, just logout
                    localStorage.removeItem("user");
                    window.location.reload();
                } catch (_error) {
                    return Promise.reject(_error);
                }
            }
        }

        return Promise.reject(error);
    }
);

export default api;
