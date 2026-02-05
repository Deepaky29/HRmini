const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const auth = require("./routers/auth");
const leave = require("./routers/leave");
const attendance = require("./routers/attendance")
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URL)
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err));

app.use("/api/auth", auth);
app.use("/api/leave", leave);
app.use("/api/attendance", attendance);

app.get("/", (req, res) => {
    res.send("HR Management API Running");
});

const PORT = process.env.PORT ;

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});
