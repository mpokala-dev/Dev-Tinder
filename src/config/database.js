const mongoose = require("mongoose");
const connectDB = async () => {
  console.log(process.env.DB_URI);
  await mongoose.connect(process.env.DB_URI);
};

module.exports = connectDB;
