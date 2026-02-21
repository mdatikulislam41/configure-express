require("dotenv").config();
const mongoose = require("mongoose");
const { DB_URL } = process.env;

const connectDB = async () => {
  try {
    if (!DB_URL) {
      throw new Error("DB url is not defined in environment variable");
    }
    await mongoose.connect(DB_URL);
    console.log("Database Connnected");
  } catch (error) {
    console.error("database connection faild", error.message);
  }
};

module.exports = { connectDB };
