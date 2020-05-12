require("dotenv").config();

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const passport = require("passport");

require("./configs/passport");

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((x) => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch((err) => {
    console.error("Error connecting to mongo", err);
  });



const app = express();

// Middleware Setup
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

// ADD SESSION SETTINGS HERE:

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 24 * 60 * 60, // 1 day
    }),
  })
);

// USE passport.initialize() and passport.session() HERE:

app.use(passport.initialize());
app.use(passport.session());

// ADD CORS SETTINGS HERE TO ALLOW CROSS-ORIGIN INTERACTION:

app.use(
  cors({
    credentials: true,
    origin: 'http://localhost:3000' // <== this will be the URL of our React app (it will be running on port 3000)
  })
);

// api routes
app.use("/api", require("./routes/building"));
app.use("/api", require("./routes/service"));
app.use("/api", require("./routes/auth"));
app.use("/api", require("./routes/user"));
app.use("/api", require("./routes/order"));


module.exports = app;
