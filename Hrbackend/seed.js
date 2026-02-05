const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

const User = require("./models/usermodels");

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("MongoDB connected...");

   const existingAdmin = await User.findOne({ 
  email: "hr@test.com" 
});
    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash("hrmanager", 10);

    const admin = await User.create({
  name: "Admin User",
  email: "hr@test.com",
  password: hashedPassword,
  role: "admin",
});

    console.log("Admin seeded successfully");
    console.log(admin);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedAdmin();
