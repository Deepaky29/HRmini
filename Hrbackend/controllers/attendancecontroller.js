const Attendance = require("../models/attendancemodels");

const markAttendance = async (req, res) => {
    try {

        const userid = req.user.id;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const nextDay = new Date(today);
        nextDay.setDate(nextDay.getDate() + 1);

        const alreadyMarked = await Attendance.findOne({
            userid,
            date: {
                $gte: today,
                $lt: nextDay
            }
        });

        if (alreadyMarked) {
            return res.status(400).json({
                message: "Attendance already marked for today"
            });
        }

        const attendance = await Attendance.create({
            userid,
            date: today,
            status: "present"
        });

        res.status(201).json(attendance);

    } catch (error) {
        res.status(500).json({ message: "server error" });
    }
}

const getMyAttendance = async (req, res) => {
    try {
        const userid = req.user.id;

        const records = await Attendance
            .find({ userid })
            .sort({ date: -1 });

        res.status(200).json(records);

    } catch (error) {
        res.status(500).json({ message: "server error" });
    }
}

const getAllAttendance = async (req, res) => {
    try {

        const { date, userid } = req.query;

        let filter = {};

        if (date) {
            const day = new Date(date);
            day.setHours(0, 0, 0, 0);

            const nextDay = new Date(day);
            nextDay.setDate(nextDay.getDate() + 1);

            filter.date = {
                $gte: day,
                $lt: nextDay
            };
        }

        if (userid) {
            filter.userid = userid;
        }

        const records = await Attendance.find(filter)
            .populate("userid", "name email")
            .sort({ date: -1 });

        res.status(200).json(records);

    } catch (error) {
        res.status(500).json({ message: "server error" });
    }
}




module.exports = {
    markAttendance,
    getMyAttendance,
    getAllAttendance
};
