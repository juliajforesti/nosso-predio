// models/order.js

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    service: { type: Schema.Types.ObjectId, ref: 'Service'},
    origin: { type: Schema.Types.ObjectId, ref: 'User'},
    status: {type: String, enum: ['Pendente', 'Confirmado', 'Entregue', 'Cancelado']},
    quantity: Number,
  },
  { timestamps: true }
);

// push na User.requests e Service.requests

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;