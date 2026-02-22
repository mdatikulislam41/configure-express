require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");
const { connectDB } = require("./config/db");
const PORT = process.env.PORT || 4000;
const startServer = async () => {
  await connectDB();
  const server = app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT})`);
  });
  const gracefulShutdown = async () => {
    console.log(" Shutting shoutdown gratefully");
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
    server.close(() => {
      console.log("Server closed");
      process.exit(0);
    });
  };
  // When app is terminated (Ctrl+C)
  process.on("SIGINT", gracefulShutdown);
  // When hosting provider stops app
  process.on("SIGTERM", gracefulShutdown);
};
startServer();
