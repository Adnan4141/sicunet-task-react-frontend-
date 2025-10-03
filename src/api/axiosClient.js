import axios from "axios";


import { toast } from "react-toastify";
import { store } from "../redux/store/store";
import { login, logout } from "../redux/feature/authSlice";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Attach accessToken to every request
axiosClient.interceptors.request.use((config) => {
  const token = store.getState().auth.user?.accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 responses
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = store.getState().auth.user?.refreshToken;
        if (!refreshToken) throw new Error("No refresh token available");

        // Use axios directly to avoid interceptor loop
        const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/refresh`, {
          token: refreshToken
        });

        const newAccessToken = res.data.accessToken;

        // Update Redux & localStorage
        const updatedUser = {
          ...store.getState().auth.user,
          accessToken: newAccessToken
        };
        store.dispatch(login(updatedUser));
        localStorage.setItem("auth", JSON.stringify(updatedUser));

        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosClient(originalRequest);
      } catch (err) {
        toast.error("Session expired. Please login again.");
        store.dispatch(logout());
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
