import axios from "axios";
import { refreshAccessToken } from "./service";

const instance = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => {
    // Nếu API trả về message lỗi ngay cả khi HTTP status là 200
    if (response?.data?.message === "Bạn chưa đăng nhập (không có token)") {
      console.warn("Không có token, redirect về trang đăng nhập.");
      localStorage.clear();
      window.location.href = "http://localhost:3000/";
      return; // chặn xử lý tiếp
    }

    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Trường hợp token hết hạn (401 Unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refresh_token = localStorage.getItem("refresh_token");
        const { access_token } = await refreshAccessToken(refresh_token);

        localStorage.setItem("access_token", access_token);
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return axios(originalRequest);
      } catch (err) {
        console.error("Không thể refresh token:", err);
        localStorage.clear();
        window.location.href = "http://localhost:3000/";
      }
    }

    // Trường hợp server trả về lỗi khác nhưng báo "chưa đăng nhập"
    if (
      error.response?.data?.message === "Bạn chưa đăng nhập (không có token)"
    ) {
      console.warn("Lỗi xác thực: chưa đăng nhập.");
      localStorage.clear();
      window.location.href = "http://localhost:3000/";
    }

    return Promise.reject(error);
  }
);

export default instance;
