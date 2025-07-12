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
  getPendingMedicationRequestsByNurse,
  getInformationNurse,
  updateInformationNurse,
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
router.post("/medications/confirm-receipt", authenticateJWT, confirmMedicationReceipt);

// GET
router.get("/students/:user_id", getStudents); // id parent
router.get("/healthprofiles/:user_id", healthprofiles); // id parent
router.get("/parents/:student_id", authenticateJWT, parentByStudent); // get parent by student id
router.get("/notifications/:user_id", getNotifications); // id parent
router.get("/periodic-notifications/:user_id", periodicNotifications);
router.get("/vaccination-notifications/:accountId", getVaccinationNotifications);
router.get("/logs/:accountId", getUserLogs);
router.get("/medications/requests/pending/:nurse_id", getPendingMedicationRequestsByNurse);
router.get("/nurse/:nurse_id", getInformationNurse);
router.get("/nurse-classes/:nurse_id", nurseClassList);
router.get("/vaccination-schedules/nurse/:nurse_id", vaccinationSchedulesByNurse);

// PUT
router.put("/account/updateProfile/:user_id", updateProfileHeath); // id parent
router.put("/parents/updateProfileParent/:user_id", putUpdateProfileParent); // id parent
router.put("/nurse/updateNurseProfile/:nurse_id", updateInformationNurse);

module.exports = router;
