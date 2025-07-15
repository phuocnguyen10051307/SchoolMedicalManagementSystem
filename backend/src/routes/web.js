const express = require("express");
const router = express.Router();
const {
  homePage,
  sendConfirmInfor,
  account,
  postDataParentSend,
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
} = require("../controllers/homeControllers");
const { authenticateJWT } = require("../middlewares/auth");

// ================= ROUTES ================= //
// khai báo route
// router.METHOD('/route',handler)
// file route chỉ định nghĩa route
// route là những đường dẫn này sẽ truyền cho frontend nhận dữ liệu

router.get("/", homePage);

// POST
router.post("/parent-request/send", postDataParentSend); // get infor of parent and create account
router.post("/parent-request/confirm", sendConfirmInfor);
router.post("/account", account); // optional: maybe deprecated?
router.post("/account/login", account); // login
router.post("/token/refresh", refreshAccessToken);
router.post("/checkups/class", createClassHealthCheckup);
router.post("/events/create", createMedicalEventController);
router.post("/medications/parent-request", createParentMedicationRequest);
router.post(
  "/medications/confirm-receipt",
  confirmMedicationReceipt
);
router.post("/scheduleByNurse", acctiveVaccinationScheduleController);
router.post("/scheduleByMager", createVaccinationScheduleControllerByManager);

// GET
router.get("/students/:user_id", getStudents); // id parent
router.get("/healthprofiles/:user_id", healthprofiles); // id parent
router.get("/parents/:student_id", authenticateJWT, parentByStudent); // get parent by student id
router.get("/events/nurse/:nurse_id", getMedicalEventsByNurse);
router.get("/notifications/:user_id", getNotifications); // id parent
router.get("/periodic-notifications/:user_id", periodicNotifications);
router.get(
  "/vaccination-notifications/:accountId",
  getVaccinationNotifications
);
router.get("/logs/:accountId", getUserLogs);
router.get(
  "/medications/requests/pending/:nurse_id",
  getPendingMedicationRequestsByNurseCo
);
router.get("/nurse/:nurse_id", getInformationNurse);
router.get("/nurse-classes/:nurse_id", nurseClassList);
router.get("/nurseGetStudent/:class_name", nurseClassStudentName);
router.get(
  "/vaccination-schedules/nurse/:nurse_id",
  vaccinationSchedulesByNurse
);
router.get("/dashboard/nurse/:nurse_id", getNurseDashboard);
router.get("/checkup-types", getCheckupTypes);
router.get("/schedules", getVaccinationSchedulesController);
router.get("/reports/:nurse_account_id", getReportsByNurse); 
router.get("/checkups/:nurse_account_id", getHealthCheckupsByNurse); 
router.get("/vaccinations/:nurse_account_id", getVaccinationReportsByNurse);
router.get(
  "/medications/getRequestsFromParent/:nurse_id",
 getApprovedMedicationFromParent
);
router.get(
  "/medications/requests/confirmed/:nurse_id",
  getConfirmedMedicationRequestsByNurse
);


// PUT
router.put("/account/updateProfile/:user_id", updateProfileHeath); // id parent
router.put("/parents/updateProfileParent/:user_id", putUpdateProfileParent); // id parent
router.put("/nurse/updateNurseProfile/:nurse_id", updateInformationNurse);
router.put("/events/update", updateMedicalEventController);

module.exports = router;
