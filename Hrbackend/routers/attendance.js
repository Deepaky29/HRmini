const express = require("express");
const router = express.Router();
const {markAttendance, getMyAttendance,getAllAttendance} = require("../controllers/attendancecontroller");
const authmiddleware = require("../middleware/authmiddleware");
const {adminmiddleware} = require("../middleware/adminmiddleware");
router.post("/mark", authmiddleware, markAttendance);
router.get("/my", authmiddleware, getMyAttendance);
router.get("/all",authmiddleware,adminmiddleware,getAllAttendance);

module.exports = router;
