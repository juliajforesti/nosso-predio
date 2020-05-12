// models/service.js

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const serviceSchema = new Schema(
  {
    name: String,
    description: String,
    category: { type: String, enum: ["Produto", "Serviço"] },
    price: Number,
    date: String,
    orders: [{ type: Schema.Types.ObjectId, ref: "Order" }],
    image: String,
    apartment: String,
    owner: { type: Schema.Types.ObjectId, ref: "User" },

    // building: [{ type: Schema.Types.ObjectId, ref: "Building" }],
  },
  { timestamps: true }
);

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;
