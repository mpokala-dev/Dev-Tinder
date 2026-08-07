const { isEmail, isStrongPassword, isInt } = require("validator");

const userDataValidationOnSignUpAndUpdate = (
  requestBody,
  apiType = "update",
) => {
  const ALLOWED_CREATE = ["firstName", "lastName", "email", "password"];
  const ALLOWED_UPDATE = [
    "age",
    "about",
    "location",
    "gender",
    "skills",
    "photoUrl",
  ];
  const req_body = requestBody;
  const ALLOW_FIELD_UPDATE =
    apiType == "update"
      ? Object.keys(req_body).every((key) => ALLOWED_UPDATE.includes(key))
      : true;
  const UPDATESKILLS = req_body?.skills ? req_body.skills?.length <= 10 : true;
  const UPDATEGENDER = req_body?.gender
    ? ["male", "female", "others"].includes(req_body.gender)
    : true;
  console.log(req_body);
  const VALIDAGE = requestBody?.age
    ? isInt(requestBody.age) && requestBody?.age >= 18
    : true;
  const isUpdateAllowed =
    ALLOW_FIELD_UPDATE && UPDATESKILLS && UPDATEGENDER && VALIDAGE;
  return isUpdateAllowed;
};

const validateSignup = (req) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Name fields are mandotory!");
  }
  if (!email || !isEmail(email.trim())) {
    throw new Error("Please enter valid email");
  }
  if (!password) {
    throw new Error("Password can not be blank");
  }
  if (!isStrongPassword(password)) {
    throw new Error("Please enter strong password");
  }
};

module.exports = { userDataValidationOnSignUpAndUpdate, validateSignup };
