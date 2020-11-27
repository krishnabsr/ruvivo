const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, validate } = require("../models/user");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

const upload = multer({ dest: "uploads/" });

router.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

router.post("/", upload.single("myImage"), async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  user = new User(_.pick(req.body, ["name", "email", "password"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  user.image.data = fs.readFileSync(path.join(req.file.path));
  user.image.contentType = "image/png";
  await user.save();
  let base64_image_string = Buffer.from(user.image.data).toString('base64');

  res.send(`<html>
    <body>
      <h3>Hello ${user.name}  </h3>
      <p> ${user.email} </p><br>
      <img src="data:image/png;base64, ${base64_image_string} ">
    </body>
  </html>`);
});

module.exports = router;
