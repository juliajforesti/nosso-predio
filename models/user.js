// models/user.js

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: String,
    email: String,
    password: String,
    buildings: [{ type: Schema.Types.ObjectId, ref: "Building" }],
    image: String,
    orders: [{ type: Schema.Types.ObjectId, ref: "Order" }],
    services: [{ type: Schema.Types.ObjectId, ref: "Service" }],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;