const adminAuthMiddleware = (req, res, next) => {
  const adminAuthToken = "my-secret-token";
  const isAuthorized = adminAuthToken === "my-secret-token";
  if (!isAuthorized) {
    return res.status(401).send("Unauthorized access");
  }
  console.log("Authorized Admin login");
  next();
};

const userAuthMiddleware = (req, res, next) => {
  const userAtuthToken = "xyz";
  const isAuthorized = userAtuthToken === "xyz2ew";
  if (!isAuthorized) {
    return res.status(401).send("Unauthorized User");
  }
  next();
};

module.exports = {
  adminAuthMiddleware,
  userAuthMiddleware,
};
