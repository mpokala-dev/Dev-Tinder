const mongoose = require("mongoose");
var validator = require("validator");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
    },
    lastName: {
      type: String,
      minlength: 2,
      maxlength: 30,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      set: (value) => value.replace(/\s+/g, ""),
      validate: function (value) {
        return validator.isEmail(value);
      },
      message: "Invalid Email Address",
    },
    password: {
      type: String,
      minlength: 3,
      required: true,
    },
    age: {
      type: Number,
      min: [18, "Age should be above 18"],
    },
    gender: {
      type: String,
      validate: {
        validator: function (value) {
          return ["male", "female", "others"].includes(value);
        },
        message: "Gender should be Male or Female or Others only!",
      },
    },
    about: {
      type: String,
      default: "this is a place where you describe your self",
      maxlength: 300,
    },
    location: {
      type: String,
      default: "traveler",
    },
    skills: {
      type: [String],
      maxlength: 10,
    },
    photoUrl: {
      type: String,
      default:
        "https://fastly.picsum.photos/id/20/3670/2462.jpg?hmac=CmQ0ln-k5ZqkdtLvVO23LjVAEabZQx2wOaT4pyeG10I",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("User", userSchema);
