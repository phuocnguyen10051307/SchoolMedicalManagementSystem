const {
  handleParentAccountRequest,
  getParentByStudentId,
  putHeathyProfile,
  updateProfileParent,
} = require("../services/parentQueries");
const { getAccount } = require("../services/accountQueries");
const {
  getInformationOfStudent,
  getHeathProfiles,
} = require("../services/studentQueries");
const { getEventNotificationsByParentId } = require("../services/eventQueries");
const homePage = (req, res) => {
  res.send("hello world");
};
const postDataParentSend = async (req, res) => {
  try {
    const result = await handleParentAccountRequest(req.body);
    const httpCode = result.status === "APPROVED" ? 201 : 200;
    res.status(httpCode).json(result);
  } catch (err) {
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
    const results = await putHeathyProfile(req, res);
  } catch (error) {
    res.status(500).json({ erorr: err.message });
  }
};

const account = async (req, res) => {
  await getAccount(req, res);
};

const getStudents = async (req, res) => {
  try {
    const { user_id } = req.params;
    const students = await getInformationOfStudent(user_id);
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ error: error.message });
  }
};

const healthprofiles = async (req, res) => {
  try {
    const { user_id } = req.params;
    const heath = await getHeathProfiles(user_id);
    res.status(200).json(heath);
  } catch (err) {
    res.status(500).json({ error: error.message });
  }
};

const parentByStudent = async (req, res) => {
  try {
    const { student_id } = req.params;
    const result = await getParentByStudentId(student_id);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: error.message });
  }
};

const getNotifications = async (req, res) => {
  try {
    const { user_id } = req.params;
    const result = await getEventNotificationsByParentId(user_id);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: error.message });
  }
};
const putUpdateProfileParent = async (req, res) => {
  try {
    const { user_id } = req.params;
    console.log(req.params)
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
  putUpdateProfileParent,
};
