const express = require("express");
const {application, approveleave,getAllLeaves,
   getMyLeaves,
   cancelLeave } = require("../controllers/leavecontroller");
const authmiddleware = require("../middleware/authmiddleware");
const {adminmiddleware} = require("../middleware/adminmiddleware");
const route = express.Router();

route.post("/apply",authmiddleware,application);
route.patch("/admin/:id",authmiddleware,adminmiddleware,approveleave);
route.get("/all",authmiddleware,adminmiddleware,getAllLeaves);

route.get("/my",
 authmiddleware,
 getMyLeaves
);

route.delete("/:id", authmiddleware,
 cancelLeave
);



module.exports = route;