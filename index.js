const express = require("express");
const app = express();
const mongoose = require("mongoose");
const multer = require("multer");
const users = require("./routes/users");

const uri =
  "mongodb+srv://krishnabsr2:A.r.u.n.1.@cluster0.3r2km.mongodb.net/ruvivo?retryWrites=true&w=majority";

mongoose
  .connect(uri)
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB..."));

app.use(express.json());
app.use(express.urlencoded({ extended: true }))


app.use("/api/users", users);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`App running on port ${port}`));
