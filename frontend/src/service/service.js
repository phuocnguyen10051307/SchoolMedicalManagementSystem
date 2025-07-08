// src/service.js
import axios from "./axiosInstance";

const API_BASE = "http://localhost:8000";

export const loginAccount = async (username, password) => {
  try {
    const response = await axios.post(`/account/login`, {
      username,
      password,
    });
    localStorage.setItem("access_token", response.data.access_token);
    localStorage.setItem("refresh_token", response.data.refresh_token);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Đăng nhập thất bại" };
  }
};
export const refreshAccessToken = async (refresh_token) => {
  const res = await axios.post("/token/refresh", { refresh_token });
  return res.data;
};

export const createAccount = async (
  studentCode,
  identify,
  phoneNumber,
  gmail,
  relationship
) => {
  try {
    const createAcc = await axios.post(`/parent-request/send`, {
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
    const inforAccount = await axios.get(`/parents/${user_id}`);
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
      `/parents/updateProfileParent/${user_id}`,
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
    const getData = await axios.get(`/healthprofiles/${user_id}`);
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
      `/account/updateProfile/${user_id}`,
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
