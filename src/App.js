console.log("Hello, DevTinder!");
const express = require("express");
const app = express();
app.get(/^\/ab*c$/, (req, res) => {
  res.send("Use case of regex in route path!");
});
app.get("/user", [
  (req, res, next) => {
    console.log("Route Handler 1");
    // res.send("Response1");
    next();
  },
  (req, res, next) => {
    console.log("Route Handler 2");
    next();
    res.send("Response2");
  },
  (req, res, next) => {
    console.log("Route Handler 3");
    next();
    res.send("Response3");
  },
  (req, res, next) => {
    console.log("Route Handler 4");
    res.send("Response4");
    next();
  },
]);
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
