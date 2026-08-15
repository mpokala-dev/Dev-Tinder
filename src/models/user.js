const mongoose = require("mongoose");
var validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
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
      validate: function (value) {
        return value >= 18;
      },
      message: "Age should be 18 or above",
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
userSchema.methods.getJWT = async function () {
  const user = this;

  const token = await jwt.sign({ _id: user._id }, process.env.SCECRET_KEY, {
    expiresIn: "1h",
  }); // jwt expires in 1 hr

  return token;
};
userSchema.methods.validatePassword = async function (pswdentered) {
  const user = this;

  const isPasswordValid = await bcrypt.compare(pswdentered, user.password);

  return isPasswordValid;
};

module.exports = mongoose.model("User", userSchema);
