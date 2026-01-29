const mongoose = require("mongoose");
require("dotenv").config();

const connectUrl = process.env.MONGODB_URI;

async function connectToDB() {
  try {
    await mongoose.connect(connectUrl);
    console.log("Database connected successfully");
  } catch (error) {
    console.log("Database failed to connect", error);
  }
}

module.exports = connectToDB;
