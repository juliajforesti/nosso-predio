const express = require("express");
const router = express.Router();
const User = require("../models/user");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const uploader = require("../configs/cloudinary");

/* GET user */
router.get("/user/:id", (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  User.findById(req.params.id)
    .populate("building")
    .populate("services")
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      res.json(err);
    });
});

// EDIT USER INFO
router.post("/edit-user/:id", (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  const { email, name } = req.body;

  User.findByIdAndUpdate(
    req.params.id,
    { $set: { email, name } },
    { new: true }
  )
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// EDIT PASSWORD
router.post("/edit-password/:id", (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  const { password } = req.body;
  const salt = bcrypt.genSaltSync(10);
  const hashPass = bcrypt.hashSync(password, salt);

  User.findByIdAndUpdate(
    req.params.id,
    { $set: { password: hashPass } },
    { new: true }
  )
    .then(() => {
      res.json({
        message: `Password of User: ${req.params.id} is updated successfully.`,
      });
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

//UPLOAD PHOTO
router.post("/edit-photo/:id", uploader.single("image"), (req, res, next) => {
  console.log(req.file)
  if (!req.file) {
    next(new Error("No file uploaded!"));
    return;
  }

  const image = req.file.secure_url;

  User.findByIdAndUpdate(req.params.id, { $set: { image } }, { new: true })
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// DELETE route => to delete a user
router.delete("/user/:id", (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  User.findByIdAndRemove(req.params.id)
    .then(() => {
      res.json({
        message: `User with ${req.params.id} is removed successfully.`,
      });
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

module.exports = router;
