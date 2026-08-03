console.log("Hello, DevTinder!");
const express = require("express");

const app = express();

const { MongoClient } = require("mongodb");
const URI = "xyz.mongodb_uri"; // Replace with your actual MongoDB connection string

const client = new MongoClient(URI);

const dbName = "HelloWorld";

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

app.get("/user/data", async (req, res) => {
  // say an error occurred while the the user data is requested and is handled by wild card route-- is the scenario the following code tries to handle
  // try {
  await client.connects(); // connects() is not a function, it should be connect()
  const db = client.db(dbName);
  const collection = db.collection("User");
  const result = await collection.find({}).toArray();
  res.send(result);
  // } catch (error) {
  //   console.error("Error occurred while fetching user data:", error);
  //   res.status(500).send("Internal Server Error");
  // }
});
app.use("/", (err, req, res, next) => {
  console.log("Error captured in the wild card", err);
  if (err) {
    res.status(500).send("Internal server error captured at wild card level");
  }
});
