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

export const getNurseProfile = async (nurse_id) => {
  try {
    const response = await axios.get(`/nurse/${nurse_id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Không thể lấy thông tin y tá" };
  }
};

export const putNurseProfile = async (
  nurse_id,
  full_name,
  phone_number,
  email,
  avatar_url,
  date_of_birth
) => {
  try {
    const response = await axios.put(
      `/nurse/updateNurseProfile/${nurse_id}`,
      {
        full_name,
        phone_number,
        email,
        avatar_url,
        date_of_birth,
      }
    );
    console.log(response.data)
    return response.data;
  } catch (error) {
    throw error.response?.data || {
      message: "Không thể cập nhật thông tin y tá",
    };
  }
};


export const getNurseClassListService = async (nurse_id) => {
  try {
    const response = await axios.get(`/nurse-classes/${nurse_id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Không thể lấy danh sách lớp của y tá" };
  }
};

export const getStudentListByClassService = async (class_name) => {
  try {
    const response = await axios.get(`/nurseGetStudent/${class_name}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Không thể lấy danh sách học sinh theo lớp" };
  }
};
export const createMedicalEventService = async (eventData) => {
  try {
    const response = await axios.post("/events/create", eventData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Tạo sự kiện y tế thất bại" };
  }
};

export const getMedicalEventsByNurseService = async (nurse_id) => {
  try {
    const response = await axios.get(`/events/nurse/${nurse_id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || {
      message: "Không thể lấy danh sách sự kiện y tế của y tá",
    };
  }
};

export const updateMedicalEventService = async (eventData) => {
  try {
    const response = await axios.put("/events/update", eventData);
    return response.data;
  } catch (error) {
    throw error.response?.data || {
      message: "Cập nhật sự kiện y tế thất bại",
    };
  }
};

export const getNurseDashboardService = async (nurse_id) => {
  try {
    const response = await axios.get(`/dashboard/nurse/${nurse_id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || {
      message: "Không thể lấy dữ liệu thống kê dashboard của y tá",
    };
  }
};
