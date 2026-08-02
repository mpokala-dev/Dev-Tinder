console.log("Hello, DevTinder!");
const express = require("express");
const app = express();
app.get(/^\/ab*c$/, (req, res) => {
  res.send("Use case of regex in route path!");
});
app.get("/user/:name/:org", (req, res) => {
  // localhost:3000/user/Alexa/Amazon?type=voice-assistant
  console.log(req.query); // { type: 'voice-assistant' }
  console.log(req.params); // { name: 'Alexa', org: 'Amazon' }
  res.send("Matched");
});
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
