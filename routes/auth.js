const express = require("express");
const authRoutes = express.Router();

const passport = require("passport");
const bcrypt = require("bcryptjs");

// require the user model !!!!
const User = require("../models/user");

// POST route => SIGNUP to create a new user
authRoutes.post("/signup", (req, res, next) => {
  const { name, email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Provide email and password" });
    return;
  }
  if (password.length < 6) {
    res.status(400).json({
      message:
        "Please make your password at least 6 characters long for security purposes.",
    });
    return;
  }

  User.findOne({ email }, (err, foundUser) => {
    if (err) {
      res.status(500).json({ message: "email check went bad." });
      return;
    }

    if (foundUser) {
      res
        .status(400)
        .json({ message: "email already used. Choose another one." });
      return;
    }

    const salt = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(password, salt);
    const newUser = new User({
      name,
      email,
      password: hashPass,
      image:
        "https://res.cloudinary.com/juliajforesti/image/upload/v1589218713/nosso-predio/user_cqrmt0.png",
    });
    newUser
      .save()
      .then((response) => {
        req.login(response, (err) => {
          if (err) {
            res.status(500).json({ message: "Login after signup went bad." });
            return;
          }
          res.json(response);
        });
      })
      .catch((err) => res.status(400).json({ message: "problem" }));
  });
});

// LOGIN

authRoutes.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, theUser, failureDetails) => {
    if (err) {
      res
        .status(500)
        .json({ message: "Something went wrong authenticating user" });
      return;
    }

    if (!theUser) {
      // "failureDetails" contains the error messages
      res.status(401).json(failureDetails);
      return;
    }

    // save user in session
    req.login(theUser, (err) => {
      if (err) {
        res.status(500).json({ message: "Session save went bad." });
        return;
      }
      res.status(200).json(theUser);
    });
  })(req, res, next);
});

authRoutes.get("/logout", (req, res, next) => {
  req.logout();
  res.status(200).json({ message: "Log out success!" });
});

authRoutes.get("/loggedin", (req, res, next) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
    return;
  }
  res.status(403).json({ message: "Unauthorized" });
});

module.exports = authRoutes;
