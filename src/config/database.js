const mongoose = require("mongoose");
require("dotenv").config();

const connectDb = async () => {
  await mongoose.connect(process.env.DB_CONNECTION_SECRET);
  console.log("Database connected");
};

module.exports = connectDb;