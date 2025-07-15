const jwt = require("jsonwebtoken");
const { generateAccessToken, verifyRefreshToken } = require("../utils/jwt");

const {
  handleParentAccountRequest,
  getParentByStudentId,
  putHeathyProfile,
  updateProfileParent,
} = require("../services/parentQueries");
const {
  createVaccinationScheduleServiceByManager,
} = require("../services/adminAndManagerQuries");

const {
  getAccount,
  getLogsByAccountId,
} = require("../services/accountQueries");

const {
  getInformationOfStudent,
  getHeathProfiles,
} = require("../services/studentQueries");

const {
  getEventNotificationsByParentId,
  getPeriodicCheckupsByParentId,
  getVaccinationNotificationsByParent,
  createClassHealthCheckupService,
  createMedicalEventService,
  createParentMedicationRequestService,
  updateMedicalEventService,
  getCheckupTypesService,
  activateVaccinationScheduleByNurseService,
  getVaccinationSchedulesService,
  getApprovedMedicationReceiptsByNurse,
  getPendingMedicationRequestsByNurse,
} = require("../services/eventQueries");

const {
  confirmParentMedicationReceiptService,
  getPendingRequestsForNurse,
  getInforNurse,
  updateNurseInfo,
  getNurseClassList,
  getVaccinationSchedulesByNurse,
  getStudentName,
  getMedicalEventsByNurseId,
  getNurseDashboardStats,
  getReportsByNurseService,
  getHealthCheckupsByNurseService,
  getVaccinationReportsByNurseService,
} = require("../services/nurseQueries");

const homePage = (req, res) => {
  res.send("hello world");
};
const postDataParentSend = async (req, res) => {
  try {
    const result = await handleParentAccountRequest(req.body);
    const httpCode = result.status === "APPROVED" ? 201 : 200;
    res.status(httpCode).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const sendConfirmInfor = async (req, res) => {
  try {
    const result = await handleParentAccountRequest(req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateProfileHeath = async (req, res) => {
  try {
    const { user_id } = req.params;
    const {
      height,
      weight,
      blood_type,
      chronic_conditions,
      allergies,
      regular_medications,
      additional_notes,
    } = req.body;
    const results = await putHeathyProfile(
      user_id,
      height,
      weight,
      blood_type,
      chronic_conditions,
      allergies,
      regular_medications,
      additional_notes
    );
    res.status(200).json({ message: "Health profile updated successfully" });
  } catch (error) {
    console.error("Error updating health profile:", error.message);
    res.status(500).json({ error: error.message });
  }
};
const createClassHealthCheckup = async (req, res) => {
  try {
    const result = await createClassHealthCheckupService(req.body);
    res.status(201).json(result);
  } catch (error) {
    console.error("Error creating class health checkup:", error.message);
    res.status(500).json({ error: error.message });
  }
};
const createMedicalEventController = async (req, res) => {
  try {
    const result = await createMedicalEventService(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const createParentMedicationRequest = async (req, res) => {
  try {
    const result = await createParentMedicationRequestService(req.body);
    res
      .status(201)
      .json({ message: "Yêu cầu gửi thuốc thành công", data: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getPendingMedicationRequestsByNurseCo = async (req, res) => {
  try {
    const { nurse_id } = req.params;

    const requests = await getPendingRequestsForNurse(nurse_id);
    console.log(requests)
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const confirmMedicationReceipt = async (req, res) => {
  try {
    //const {nurse_account_id} = req.user.user_id; // lấy từ token
    const { request_id, received_quantity, nurse_account_id } = req.body;


    const result = await confirmParentMedicationReceiptService({
      request_id,
      nurse_account_id,
      received_quantity,
    });

    res.status(200).json({
      message: "Y tá đã xác nhận nhận thuốc thành công",
      data: result,
    });
  } catch (error) {
    if (error.status === 403) {
      return res.status(403).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};
const getInformationNurse = async (req, res) => {
  try {
    const { nurse_id } = req.params;

    const requests = await getInforNurse(nurse_id);

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const updateInformationNurse = async (req, res) => {
  try {
    const { nurse_id } = req.params;
    const { full_name, phone_number, email, avatar_url, date_of_birth } =
      req.body;
    console.log(date_of_birth);
    const requests = await updateNurseInfo(
      nurse_id,
      full_name,
      phone_number,
      email,
      avatar_url,
      date_of_birth
    );
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const account = async (req, res) => {
  await getAccount(req, res);
};
const refreshAccessToken = async (req, res) => {
  const { refresh_token } = req.body;
  if (!refresh_token)
    return res.status(400).json({ message: "Thiếu refresh token" });

  try {
    const user = verifyRefreshToken(refresh_token);
    const newAccessToken = generateAccessToken({
      user_id: user.user_id,
      username: user.username,
      role: user.role,
    });

    res.status(200).json({ access_token: newAccessToken });
  } catch (err) {
    return res
      .status(403)
      .json({ message: "Refresh token không hợp lệ hoặc đã hết hạn" });
  }
};

const getStudents = async (req, res) => {
  try {
    const { user_id } = req.params;
    const students = await getInformationOfStudent(user_id);
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const healthprofiles = async (req, res) => {
  try {
    const { user_id } = req.params;
    const heath = await getHeathProfiles(user_id);
    res.status(200).json(heath);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const parentByStudent = async (req, res) => {
  try {
    const { student_id } = req.params;
    const result = await getParentByStudentId(student_id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getNotifications = async (req, res) => {
  try {
    const { user_id } = req.params;
    const result = await getEventNotificationsByParentId(user_id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const putUpdateProfileParent = async (req, res) => {
  try {
    const { user_id } = req.params;
    const {
      full_name,
      phone_number,
      email,
      date_of_birth,
      occupation,
      address,
      identity_number,
      avatar_url,
    } = req.body;

    await updateProfileParent(
      user_id,
      full_name,
      phone_number,
      email,
      date_of_birth,
      occupation,
      address,
      identity_number,
      avatar_url
    );
    res.status(200).json({ message: "Cập nhật hồ sơ phụ huynh thành công" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const periodicNotifications = async (req, res) => {
  try {
    const { user_id } = req.params;
    const result = await getPeriodicCheckupsByParentId(user_id);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getVaccinationNotifications = async (req, res) => {
  const accountId = req.params.accountId;
  try {
    const notifications = await getVaccinationNotificationsByParent(accountId);
    res.status(200).json({ success: true, data: notifications });
  } catch (err) {
    console.error("Error getting vaccination notifications:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getUserLogs = async (req, res) => {
  const { accountId } = req.params;
  try {
    const logs = await getLogsByAccountId(accountId);
    res.status(200).json({ success: true, data: logs });
  } catch (err) {
    console.error("Error getting user logs:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const nurseClassList = async (req, res) => {
  try {
    const { nurse_id } = req.params;
    const result = await getNurseClassList(nurse_id);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const nurseClassStudentName = async (req, res) => {
  try {
    const { class_name } = req.params;
    const result = await getStudentName(class_name);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const vaccinationSchedulesByNurse = async (req, res) => {
  try {
    const { nurse_id } = req.params;
    const result = await getVaccinationSchedulesByNurse(nurse_id);
    res.status(200).json(result);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: err.message });
  }
};
const getMedicalEventsByNurse = async (req, res) => {
  try {
    const { nurse_id } = req.params;
    const events = await getMedicalEventsByNurseId(nurse_id);
    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events by nurse:", error);
    res.status(500).json({ error: error.message });
  }
};
const updateMedicalEventController = async (req, res) => {
  try {
    const result = await updateMedicalEventService(req.body);
    console.log(req.body);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error updating medical event:", error.message);
    res.status(500).json({ error: error.message });
  }
};
const getNurseDashboard = async (req, res) => {
  try {
    const { nurse_id } = req.params;
    const result = await getNurseDashboardStats(nurse_id);
    res.status(200).json(result);
  } catch (err) {
    console.error("Error getting nurse dashboard:", err);
    res.status(500).json({ error: err.message });
  }
};
const getCheckupTypes = async (req, res) => {
  try {
    const result = await getCheckupTypesService();
    res.status(200).json(result);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách loại kiểm tra:", error.message);
    res.status(500).json({ error: "Lỗi server" });
  }
};
const acctiveVaccinationScheduleController = async (req, res) => {
  try {
    const result = await activateVaccinationScheduleByNurseService(req.body);
    res.status(201).json(result);
  } catch (error) {
    console.error("Error creating vaccination schedule:", error);
    res.status(500).json({ error: error.message });
  }
};
const getVaccinationSchedulesController = async (req, res) => {
  try {
    const schedules = await getVaccinationSchedulesService();
    res.status(200).json(schedules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getReportsByNurse = async (req, res) => {
  const { nurse_account_id } = req.params;

  try {
    const reports = await getReportsByNurseService(nurse_account_id);
    res.status(200).json(reports);
  } catch (error) {
    console.error("Lỗi khi lấy báo cáo:", error);
    res.status(500).json({ error: "Không thể lấy báo cáo của y tá" });
  }
};
const getHealthCheckupsByNurse = async (req, res) => {
  const { nurse_account_id } = req.params;

  try {
    const checkups = await getHealthCheckupsByNurseService(nurse_account_id);
    res.status(200).json(checkups);
  } catch (error) {
    console.error("Lỗi khi lấy kiểm tra sức khỏe:", error);
    res.status(500).json({ error: "Không thể lấy kiểm tra sức khỏe" });
  }
};
const getVaccinationReportsByNurse = async (req, res) => {
  const { nurse_account_id } = req.params;

  try {
    const results = await getVaccinationReportsByNurseService(nurse_account_id);
    res.status(200).json(results);
  } catch (error) {
    console.error("Lỗi khi lấy lịch tiêm chủng:", error);
    res.status(500).json({ error: "Không thể lấy lịch tiêm chủng" });
  }
};
const createVaccinationScheduleControllerByManager = async (req, res) => {
  const { account_id, vaccine_name, vaccination_date, target_age_group } =
    req.body;

  try {
    const result = await createVaccinationScheduleServiceByManager({
      account_id,
      vaccine_name,
      vaccination_date,
      target_age_group,
    });

    res.status(201).json(result);
  } catch (error) {
    const status = error.status || 500;
    const message = error.message || "Đã xảy ra lỗi khi tạo lịch tiêm chủng.";
    res.status(status).json({ error: message });
  }
};

const getApprovedMedicationFromParent = async (req, res) => {
  try {
    const { nurse_id } = req.params;
    const result = await getApprovedMedicationReceiptsByNurse(nurse_id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getConfirmedMedicationRequestsByNurse = async (req, res) => {
  try {
    const { nurse_id } = req.params;
    const result = await getConfirmedRequestsForNurse(nurse_id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  homePage,
  sendConfirmInfor,
  postDataParentSend,
  account,
  getStudents,
  healthprofiles,
  parentByStudent,
  getNotifications,
  updateProfileHeath,
  periodicNotifications,
  getVaccinationNotifications,
  getUserLogs,
  nurseClassList,
  vaccinationSchedulesByNurse,
  putUpdateProfileParent,
  refreshAccessToken,
  createClassHealthCheckup,
  createMedicalEventController,
  createParentMedicationRequest,
  confirmMedicationReceipt,
  getPendingMedicationRequestsByNurseCo,
  getInformationNurse,
  updateInformationNurse,
  nurseClassStudentName,
  getMedicalEventsByNurse,
  updateMedicalEventController,
  getNurseDashboard,
  getCheckupTypes,
  acctiveVaccinationScheduleController,
  getVaccinationSchedulesController,
  getReportsByNurse,
  getHealthCheckupsByNurse,
  getVaccinationReportsByNurse,
  createVaccinationScheduleControllerByManager,
  getApprovedMedicationFromParent,
  getConfirmedMedicationRequestsByNurse,
};
