const express = require('express')
const router = express.Router();
const {homePage, sendConfirmInfor,account ,postDataParentSend}= require('../controllers/homeControllers')

// khai báo route
// router.METHOD('/route',handler)
// file route chỉ định nghĩa route 

router.get('/',homePage)
router.post('/parent-request/send', postDataParentSend);  // this must match your request
router.post('/parent-request/confirm', sendConfirmInfor); // if used
router.post('/account', account);

module.exports = router