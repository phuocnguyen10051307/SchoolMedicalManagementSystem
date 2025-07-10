
const { handleParentAccountRequest, getParentByStudentId } = require("../services/parentQueries");
const { getAccount, getLogsByAccountId } = require("../services/accountQueries");
const { getInformationOfStudent, getHeathProfiles } = require("../services/studentQueries");
const { getEventNotificationsByParentId, getPeriodicCheckupsByParentId, getVaccinationNotificationsByParent } = require("../services/eventQueries");
const { getNurseClassList } = require('../services/nurseQueries');
const homePage = (req, res) => {
  res.send("hello world");
};
const postDataParentSend = async (req, res) => {
  try {
    const result = await handleParentAccountRequest(req.body);
    const httpCode = result.status === 'APPROVED' ? 201 : 200;
    res.status(httpCode).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
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


const updateProfileHeath=async(req,res)=>{
  try {
    const results = await putHeathyProfile(req,res)
  } catch (error) {
    res.status(500).json({erorr:err.message})
    
  }
}

const account = async (req, res) => {
  await getAccount(req, res);
};

const getStudents = async (req, res) => {
  try {
    const { user_id } = req.params;
    const students = await getInformationOfStudent(user_id);
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const healthprofiles = async (req, res) => {
  try {
    const { user_id } = req.params;
    const heath = await getHeathProfiles(user_id);
    res.status(200).json(heath);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const parentByStudent = async (req, res) => {
  try {
    const { student_id } = req.params;
    const result = await getParentByStudentId(student_id);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getNotifications = async (req, res) => {
  try {
    const { user_id } = req.params;
    const result = await getEventNotificationsByParentId(user_id);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
    console.error('Error getting vaccination notifications:', err);
    res.status(500).json({ success: false, message: 'Server error' });
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
  nurseClassList
};

