const {handleParentAccountRequest,getAccount, getAllStudents} = require('../services/CRUDWithParent')
const homePage = (req, res)=>{
    res.send('hello world')
}
const postDataParentSend = async (req, res) => {
  try {
    const result = await handleParentAccountRequest(req.body);
    res.status(200).json(result);
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

const account = async (req,res)=>{
    await getAccount(req,res)
}



const getStudents = async (req, res) => {
  try {
    const students = await getAllStudents();
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
module.exports = {homePage,sendConfirmInfor,postDataParentSend,account, getStudents}