require("dotenv").config();

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_AUTH,
    },
    function (accessToken, refreshToken, profile, cb) {
      User.findOne({ email: profile.emails[0].value })
        .then(user => {
          if(user){
            cb(null, user);
            return;
          }
          User.create({
            googleId: profile.id,
            name: profile.name.givenName,
            email: profile.emails[0].value,
            image: "https://res.cloudinary.com/juliajforesti/image/upload/v1589218713/nosso-predio/user_cqrmt0.png",
          }).then(newUser => {
            cb(null, newUser)
          }).catch(error => cb(error))
        })
        .catch(error => cb(error))
    }
  )
);
