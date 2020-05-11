// models/building.js

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const buildingSchema = new Schema(
  {
    name: String,
    address: String,
    image: String,
    residents:[{ type: Schema.Types.ObjectId, ref: 'User'}],
    services: [{ type: Schema.Types.ObjectId, ref: "Service" }],
    owner: { type: Schema.Types.ObjectId, ref: 'User'},
  },
  { timestamps: true }
);

const Building = mongoose.model("Building", buildingSchema);

module.exports = Building;