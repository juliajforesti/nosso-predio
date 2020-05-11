// models/user.js

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: String,
    email: String,
    password: String,
    building: [{ type: Schema.Types.ObjectId, ref: "Building" }],
    image: String,
    requests: [],
    services: [{ type: Schema.Types.ObjectId, ref: "Service" }],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;