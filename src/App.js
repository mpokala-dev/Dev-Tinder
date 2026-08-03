console.log("Hello, DevTinder!");
const express = require("express");
const app = express();
const {
  adminAuthMiddleware,
  userAuthMiddleware,
} = require("./middlewares/auth");

app.use("/admin", adminAuthMiddleware);
app.get("/admin/getAllUsers", (req, res) => {
  console.log("Admin route accessed");
  res.send("All users data");
});
app.delete("/admin/deleteUser/:id", (req, res) => {
  const userId = req.params.id;
  console.log(`Admin route accessed to delete user with ID: ${userId}`);
  res.send("Admin deleted the User");
});
app.post("/user/login", (req, res) => {
  console.log("User login successful");
  res.send("User login data");
});
app.get("/user/data", userAuthMiddleware, (req, res) => {
  console.log("User data fetched");
  res.send("User data");
});
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
