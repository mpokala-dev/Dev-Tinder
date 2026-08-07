const { isEmail, isStrongPassword, isInt, isEmpty } = require("validator");

const userDataValidationOnSignup = (userObj) => {
  const ALLOWED_CREATE = ["firstName", "lastName", "email", "password"];
  const ALLOW_SIGN_UP = Object.keys(userObj).every((key) =>
    ALLOWED_CREATE.includes(key),
  );
  return ALLOW_SIGN_UP;
};

const userDataValidationOnUpdate = (req) => {
  const requestBody = req;
  const ALLOWED_UPDATE = [
    "firstName",
    "lastName",
    "age",
    "about",
    "location",
    "gender",
    "skills",
    "photoUrl",
  ];
  const ALLOW_FIELD_UPDATE = Object.keys(requestBody).every((key) =>
    ALLOWED_UPDATE.includes(key),
  );

  const VALID_FIRST_NAME =
    (requestBody?.firstName && !isEmpty(requestBody.firstName)) ?? true;

  const VALID_LAST_NAME =
    (requestBody?.lastName && !isEmpty(requestBody.lastName)) ?? true;

  const VALIDNAME = VALID_FIRST_NAME && VALID_LAST_NAME;

  const UPDATESKILLS = requestBody?.skills
    ? requestBody.skills?.length <= 10
    : true;
  const UPDATEGENDER = requestBody?.gender
    ? ["male", "female", "others"].includes(requestBody.gender)
    : true;
  const VALIDAGE = requestBody?.age
    ? isInt(requestBody.age) && requestBody?.age >= 18
    : true;
  const isUpdateAllowed =
    ALLOW_FIELD_UPDATE && UPDATESKILLS && UPDATEGENDER && VALIDAGE && VALIDNAME;

  console.log(
    ALLOW_FIELD_UPDATE,
    UPDATESKILLS,
    UPDATEGENDER,
    VALIDAGE,
    VALIDNAME,
  );
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

module.exports = {
  userDataValidationOnUpdate,
  validateSignup,
  userDataValidationOnSignup,
};
