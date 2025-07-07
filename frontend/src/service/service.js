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

export const getInforAccount = async (user_id) => {
  try {
    const inforAccount = await axios.get(`${API_BASE}/parents/${user_id}`);
    return inforAccount.data;
  } catch (error) {
    throw error.inforAccount?.data || { message: "get data failed" };
  }
};
export const putParentProfile = async (
  user_id,
  full_name,
  phone_number,
  email,
  date_of_birth,
  occupation,
  address,
  identity_number,
  avatar_url
) => {
  try {
    const updateProfile = await axios.put(
      `${API_BASE}/parents/updateProfileParent/${user_id}`,
      {
        full_name,
        phone_number,
        email,
        date_of_birth,
        occupation,
        address,
        identity_number,
        avatar_url,
      }
    );
    return updateProfile.data;
  } catch (error) {
    throw (
      error.updateProfile?.data || {
        message: "can't update information of parent ",
      }
    );
  }
};

export const getHealthProfile = async (user_id) => {
  try {
    const getData = await axios.get(`${API_BASE}/healthprofiles/${user_id}`);
    return getData.data;
  } catch (error) {
    throw (
      error.getData?.data || {
        message: "can not get data profile healthy of student",
      }
    );
  }
};
export const putHealthProfileOfStudent = async (
  user_id,
  height,
  weight,
  blood_type,
  chronic_conditions,
  allergies,
  regular_medications,
  additional_notes
) => {
  try {
    const updateHealth = await axios.put(
      `${API_BASE}/account/updateProfile/${user_id}`,
      {
        height,
        weight,
        blood_type,
        chronic_conditions,
        allergies,
        regular_medications,
        additional_notes,
      }
    );
    return updateHealth.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Can't update health profile of student",
      }
    );
  }
};
