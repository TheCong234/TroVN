import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { refreshToken } from "./user";
import useUserStore from "@/hooks/useUserStore";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_APP_BACKEND_URL + "/api/v1",
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 60000,
});

const addAuthorizationHeader = async (config) => {
    let token = useUserStore.getState().token;
    if (token) {
        // const decodedToken = jwtDecode(token);
        // const currentTime = Math.floor(Date.now() / 1000);
        // if (decodedToken.exp < currentTime) {
        //     try {
        //         const { data } = await refreshToken();
        //         if (data) {
        //             token = data;
        //             localStorage.setItem("token", JSON.stringify(token));
        //         }
        //     } catch (error) {
        //         console.error("Failed to refresh token:", error);
        //         return Promise.reject(error);
        //     }
        // }

        config.headers.Authorization = "Bearer " + token;
    }
    return config;
};

apiClient.interceptors.request.use(addAuthorizationHeader, (error) =>
    Promise.reject(error)
);

export { apiClient };
