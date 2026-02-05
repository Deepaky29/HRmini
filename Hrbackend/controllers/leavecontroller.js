const User = require("../models/usermodels");
const Leave = require("../models/leavemodels");

const application = async (req, res) => {
    try {
        const { leavetype, startdate, enddate, reason } = req.body;

        if (!leavetype || !startdate || !enddate || !reason) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        const start = new Date(startdate);
        const end = new Date(enddate);

        if (start > end) {
            return res.status(400).json({
                message: "Start date must be before end date",
            });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (start < today) {
            return res.status(400).json({
                message: "Cannot apply leave for past dates",
            });
        }

        const existingLeave = await Leave.findOne({
            userid: req.user.id,
            status: { $ne: "rejected" },
            startdate: { $lte: end },
            enddate: { $gte: start },
        });

        if (existingLeave) {
            return res.status(400).json({
                message: "You already applied for leave on these dates",
            });
        }

        const totaldays =
            Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

        const employee = await User.findById(req.user.id);

        const reservedLeaves = await Leave.aggregate([
            {
                $match: {
                    userid: employee._id,
                    status: { $in: ["pending", "approved"] },
                },
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$totaldays" },
                },
            },
        ]);

        const usedLeaves = reservedLeaves[0]?.total || 0;

        if (usedLeaves + totaldays > employee.leaveBalance) {
            return res.status(400).json({
                message: "Not enough leave balance",
            });
        }

        const leave = await Leave.create({
            userid: employee._id,
            leavetype,
            startdate: start,
            enddate: end,
            totaldays,
            reason,
            status: "pending",
        });

        return res.status(201).json({
            message: "Leave applied successfully",
            leave,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error",
        });
    }
};

const approveleave = async (req, res) => {
    try {

        const { id } = req.params;
        const { status } = req.body;

        if (!["approved", "rejected"].includes(status)) {
            return res.status(400).json({
                message: "Invalid status"
            });
        }

        const leave = await Leave.findById(id);

        if (!leave) {
            return res.status(404).json({
                message: "Leave not found"
            });
        }

        if (leave.status !== "pending") {
            return res.status(400).json({
                message: "Leave already processed"
            });
        }

        const user = await User.findById(leave.userid);

        if (status === "approved") {

            if (user.leaveBalance < leave.totaldays) {

                leave.status = "rejected";
                await leave.save();

                return res.status(400).json({
                    message: "Insufficient balance — leave rejected"
                });
            }

            user.leaveBalance -= leave.totaldays;
            await user.save();
        }

        leave.status = status;
        await leave.save();

        res.status(200).json({
            message: `Leave ${status} successfully`
        });

    }
    catch (error) {
        res.status(500).json({
            message: "server error"
        });
    }
}
const getAllLeaves = async (req, res) => {
  try {

    const leaves = await Leave.find().populate("userid","name email")


    res.status(200).json(leaves);

  } catch (error) {

    console.log("GET ALL LEAVES ERROR:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

const getMyLeaves = async (req, res) => {
    try {

        const leaves = await Leave.find({
            userid: req.user.id
        }).sort({ createdAt: -1 });

        res.status(200).json(leaves);

    } catch (error) {
        res.status(500).json({ message: "server error" });
    }
}
const cancelLeave = async (req, res) => {
    try {

        const { id } = req.params;

        const leave = await Leave.findById(id);

        if (!leave) {
            return res.status(404).json({
                message: "Leave not found"
            });
        }

        if (leave.userid.toString() !== req.user.id) {
            return res.status(403).json({
                message: "Unauthorized"
            });
        }

        if (leave.status !== "pending") {
            return res.status(400).json({
                message: "Only pending leave can be cancelled"
            });
        }

        await leave.deleteOne();

        res.status(200).json({
            message: "Leave cancelled successfully"
        });

    } catch (error) {
        res.status(500).json({ message: "server error" });
    }
}


module.exports = { application, approveleave,getAllLeaves,
   getMyLeaves,
   cancelLeave };
