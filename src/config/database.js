const mongoose = require("mongoose");
const { DB_URI } = require("./env");
const connectDB = mongoose.connect(DB_URI);

module.exports = connectDB;
