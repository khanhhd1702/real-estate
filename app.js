const express = require("express");
const app = express();
const mongoose = require("mongoose");
const userRouter = require("./src/routes/user.router");
const jsend = require("./src/utils/jsend");
const version = "/api/v1/";

mongoose.connect("mongodb://localhost:27017/real-estate");

app.use(express.json());

app.use(jsend);

app.use(version + "user", userRouter);

app.listen(8000, () => {
  console.log("API listening on port 8000");
});
