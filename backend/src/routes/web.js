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
  nurseClassList
} = require("../controllers/homeControllers");

// khai báo route
// router.METHOD('/route',handler)
// file route chỉ định nghĩa route
// route là những đường dẫn này sẽ truyền cho frontend nhận dữ liệu

router.get("/", homePage);
router.post("/parent-request/send", postDataParentSend);
router.post("/parent-request/confirm", sendConfirmInfor);
router.post("/account", account);
router.post("/account/updateProfile/", updateProfileHeath);
router.post("/account/login", account);
router.get("/students/:user_id", getStudents);
router.get("/healthprofiles/:user_id", healthprofiles);
router.get("/parents/:student_id", parentByStudent);
router.get("/notifications/:user_id", getNotifications);
router.get("/periodic-notifications/:user_id", periodicNotifications);
router.get("/vaccination-notifications/:accountId", getVaccinationNotifications);
router.get("/logs/:accountId", getUserLogs);
router.get('/nurse-classes/:nurse_id', nurseClassList);


module.exports = router;
