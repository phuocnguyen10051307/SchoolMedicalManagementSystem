// src/service.js
import axios from "axios";

export const fetchData = async () => {
  try {
    const response = await axios.get("/data/school_health_data.json");
    return response.data; // Trả về toàn bộ dữ liệu
  } catch (error) {
    throw error;
  }
};
