const jwt = require("jsonwebtoken");
const ACCESS_SECRET = process.env.JWT_ACCESS_TOKEN;
const REFRESH_SECRET = process.env.JWT_REFRESH_TOKEN;
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
    res.status(500).json({ erorr: error.message });
  }
};

const account = async (req, res) => {
  await getAccount(req, res);
};
const refreshAccessToken = async (req, res) => {
  const { refresh_token } = req.body;
  if (!refresh_token) return res.status(400).json({ message: "Thiếu refresh token" });

  try {
    const user = jwt.verify(refresh_token, REFRESH_SECRET);

    const newAccessToken = jwt.sign(
      {
        user_id: user.user_id,
        username: user.username,
        role: user.role,
      },
      ACCESS_SECRET,
      { expiresIn: "15m" }
    );

    res.status(200).json({ access_token: newAccessToken });
  } catch (err) {
    return res.status(403).json({ message: "Refresh token không hợp lệ hoặc đã hết hạn" });
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
    console.log(req.params);
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
  refreshAccessToken
};
