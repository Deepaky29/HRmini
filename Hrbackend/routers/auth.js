const express = require("express");
const {Registeruser,login,Profile} = require("../controllers/authcontroller");
const authmiddleware = require("../middleware/authmiddleware");
const route = express.Router();

route.post("/register",Registeruser),
route.post("/login",login);
route.get("/profile",authmiddleware,Profile);

module.exports=route;
