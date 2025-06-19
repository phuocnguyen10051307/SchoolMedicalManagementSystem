// src/service.js
import axios from "axios";

const API_BASE = "http://localhost:8000"

export const fetchData = async () => {
  try {
    const response = await axios.get("/data/school_health_data.json");
    return response.data; // Trả về toàn bộ dữ liệu
  } catch (error) {
    throw error;
  }
};
export const loginAccount = async (username, password) => {
  try {
    const response = await axios.post(`${API_BASE}/account/login`, {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Đăng nhập thất bại" };
  }
};
