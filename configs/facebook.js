require("dotenv").config();

const passport = require("passport");
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require("../models/user");

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: process.env.FACEBOOK_AUTH
},
    function (accessToken, refreshToken, profile, cb) {
      User.findOne({ email: profile.emails[0].value })
        .then(user => {
          console.log("proflie.id: ", profile.id)
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
            console.log(newUser)
            cb(null, newUser)
          }).catch(error => cb(error))
        })
        .catch(error => cb(error))
    }
  )
);
