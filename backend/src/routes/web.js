const express = require('express')
const router = express.Router();
const {homePage, sendConfirmInfor,account ,postDataParentSend, getStudents, healthprofiles}= require('../controllers/homeControllers')

// khai báo route
// router.METHOD('/route',handler)
// file route chỉ định nghĩa route 
// route là những đường dẫn này sẽ truyền cho frontend nhận dữ liệu 

router.get('/',homePage)
router.post('/parent-request/send', postDataParentSend);  
router.post('/parent-request/confirm', sendConfirmInfor); 
router.post('/account/login', account);
router.get('/students/:user_id', getStudents);
router.get('/healthprofiles/:user_id', healthprofiles);

module.exports = router