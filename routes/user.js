const express = require("express");
const router = express.Router();
const User = require("../models/user");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

/* GET user */
router.get("/user/:id", (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  User.findById(req.params.id)
    .populate("building", "services")
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

  const { email, name, password } = req.body;
  const salt = bcrypt.genSaltSync(10);
  const hashPass = bcrypt.hashSync(password, salt);

  User.findByIdAndUpdate(
    req.params.id,
    { $set: { email, name, password: hashPass } },
    { new: true }
  )
    .then(() => {
      res.json({
        message: `User with ${req.params.id} is updated successfully.`,
      });
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
