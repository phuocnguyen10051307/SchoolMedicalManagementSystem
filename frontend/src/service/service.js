import axios from "./axiosInstance";

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
    const updateHealth = await axios.put(`/account/updateProfile/${user_id}`, {
      height,
      weight,
      blood_type,
      chronic_conditions,
      allergies,
      regular_medications,
      additional_notes,
    });
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
    const response = await axios.put(`/nurse/updateNurseProfile/${nurse_id}`, {
      full_name,
      phone_number,
      email,
      avatar_url,
      date_of_birth,
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Không thể cập nhật thông tin y tá",
      }
    );
  }
};

export const getNurseClassListService = async (nurse_id) => {
  try {
    const response = await axios.get(`/nurse-classes/${nurse_id}`);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Không thể lấy danh sách lớp của y tá",
      }
    );
  }
};

export const getStudentListByClassService = async (class_name) => {
  try {
    const response = await axios.get(`/nurseGetStudent/${class_name}`);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Không thể lấy danh sách học sinh theo lớp",
      }
    );
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
    throw (
      error.response?.data || {
        message: "Không thể lấy danh sách sự kiện y tế của y tá",
      }
    );
  }
};

export const updateMedicalEventService = async (eventData) => {
  try {
    const response = await axios.put("/events/update", eventData);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Cập nhật sự kiện y tế thất bại",
      }
    );
  }
};

export const getNurseDashboardService = async (nurse_id) => {
  try {
    const response = await axios.get(`/dashboard/nurse/${nurse_id}`);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Không thể lấy dữ liệu thống kê dashboard của y tá",
      }
    );
  }
};

export const getCheckupTypes = async () => {
  try {
    const response = await axios.get("/checkup-types");
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Không thể lấy danh sách loại kiểm tra sức khỏe",
      }
    );
  }
};

export const createClassHealthCheckupService = async ({
  nurse_account_id,
  checkup_date,
  checkup_type,
  notes,
}) => {
  try {
    const response = await axios.post("/checkups/class", {
      nurse_account_id,
      checkup_date,
      checkup_type,
      notes,
    });
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Không thể tạo sự kiện kiểm tra sức khỏe định kỳ",
      }
    );
  }
};

export const getAllVaccinationSchedules = async () => {
  try {
    const response = await axios.get("/schedules");
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Không thể lấy danh sách lịch tiêm chủng",
      }
    );
  }
};
export const createVaccinationScheduleService = async ({
  nurse_account_id,
  vaccine_name,
  vaccination_date,
  target_age_group,
}) => {
  try {
    const response = await axios.post("/vaccination/schedules/create", {
      nurse_account_id,
      vaccine_name,
      vaccination_date,
      target_age_group,
    });
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Không thể tạo lịch tiêm chủng",
      }
    );
  }
};
export const getVaccinationSchedulesService = async (nurse_id) => {
  try {
    const response = await axios.get(`/vaccination/schedules/${nurse_id}`);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Không thể lấy danh sách lịch tiêm chủng của y tá",
      }
    );
  }
};

export const getHealthCheckupsByNurseService = async (nurse_id) => {
  try {
    const response = await axios.get(`/checkups/${nurse_id}`);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Không thể lấy danh sách kiểm tra sức khỏe của y tá",
      }
    );
  }
};

export const getVaccinationReportsByNurseService = async (nurse_id) => {
  try {
    const response = await axios.get(`/vaccinations/${nurse_id}`);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Không thể lấy danh sách lịch tiêm chủng báo cáo của y tá",
      }
    );
  }
};

export const activateVaccinationScheduleService = async ({
  nurse_account_id,
  schedule_id,
  notes,
}) => {
  try {
    const response = await axios.post("/scheduleByNurse", {
      nurse_account_id,
      schedule_id,
      notes,
    });
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Không thể kích hoạt lịch tiêm và gửi thông báo",
      }
    );
  }
};

export const getApprovedMedicationFromParent = async (nurse_id) => {
  try {
    const response = await axios.get(
      `/medications/getRequestsFromParent/${nurse_id}`
    );
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Không thể lấy danh sách thuốc phụ huynh gửi",
      }
    );
  }
};

export const confirmMedicationReceiptService = async ({
  request_id,
  nurse_account_id,
  received_quantity,
}) => {
  try {
    const response = await axios.post("/medications/confirm-receipt", {
      request_id,
      nurse_account_id,
      received_quantity,
    });
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Xác nhận nhận thuốc thất bại",
      }
    );
  }
};

export const getMedicationPendingParentSent = async (nurse_id) => {
  try {
    const response = await axios.get(
      `/medications/requests/pending/${nurse_id}`
    );
    console.log(response);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Không thể lấy danh sách thuốc đã xác nhận",
      }
    );
  }
};

export const createParentMedicationRequest = async ({
  student_id,
  medication_name,
  dosage,
  instructions,
  notes,
  medication_type = "TEMPORARY",
  requested_by_id,
}) => {
  try {
    const response = await axios.post("/medications/parent-request", {
      student_id,
      medication_name,
      dosage,
      instructions,
      notes,
      medication_type,
      requested_by_id,
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Gửi yêu cầu thuốc thất bại" };
  }
};
