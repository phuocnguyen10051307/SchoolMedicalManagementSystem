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
  putUpdateProfileParent,
  refreshAccessToken
} = require("../controllers/homeControllers");
const { authenticateJWT }= require("../middlewares/auth")

// khai báo route
// router.METHOD('/route',handler)
// file route chỉ định nghĩa route
// route là những đường dẫn này sẽ truyền cho frontend nhận dữ liệu

router.get("/", homePage);
router.post("/parent-request/send", postDataParentSend);// get infor of parent and create account
router.post("/account/login", account);// username and password of user
router.post("/token/refresh", refreshAccessToken);

router.get("/students/:user_id", getStudents);// id parent
router.get("/healthprofiles/:user_id", healthprofiles);// id parent

router.get("/notifications/:user_id", getNotifications);// id parent 
router.get("/parents/:student_id",authenticateJWT, parentByStudent)// id parent

router.put("/account/updateProfile/:user_id", updateProfileHeath); // id parent
router.put("/parents/updateProfileParent/:user_id", putUpdateProfileParent);// id parent


module.exports = router;
