// src/service.js
import axios from "axios";

const API_BASE = "http://localhost:8000";

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

export const createAccount = async (
  studentCode,
  identify,
  phoneNumber,
  gmail,
  relationship
) => {
  try {
    const createAcc = await axios.post(`${API_BASE}/parent-request/send`, {
      student_code: studentCode,
      cccd: identify,
      phone: phoneNumber,
      email: gmail,
      relationship: relationship,
    });
    return createAcc.data;
  } catch (error) {
    throw error.response?.data || { message: "Create account failed" };
  }
};


export const getInforAccount = async(user_id)=>{
  try {
    const inforAccount = await axios.get(`${API_BASE}/parents/${user_id}`)
    return inforAccount.data;
  } catch (error) {
     throw error.response?.data || { message: "get data failed" };
  }
}

