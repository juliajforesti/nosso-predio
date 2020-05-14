const express = require("express");
const router = express.Router();
const Service = require("../models/service");
const User = require("../models/user");
const Order = require("../models/order");

router.post(
  "/building/:buildingId/service/:serviceId/add-order",
  (req, res) => {
    const serviceId = req.params.serviceId;

    const { quantity } = req.body;
    Order.create({
      quantity,
      origin: req.user._id,
      service: serviceId,
      status: "Pendente",
    })
      .then((order) => {
        Service.findByIdAndUpdate(
          serviceId,
          { $push: { orders: order } },
          { new: true }
        )
          .then((response) => {
            User.findByIdAndUpdate(
              req.user._id,
              { $push: { orders: order } },
              { new: true }
            )
              .then((resp) => res.status(200).json(resp))
              .catch((err) => res.status(500).json(err));
          })
          .catch((err) => res.status(500).json(err));
      })
      .catch((err) => res.status(500).json(err));
  }
);

//GET ALL ORDERS
router.get("/orders", (req, res) => {
  Order.find()
    .then((orders) => {
      res.status(200).json(orders);
    })
    .catch((err) => res.status(500).json(err));
});

router.post(
  "/building/:buildingId/service/:serviceId/status-order/:orderId",
  (req, res) => {
    const orderId = req.params.orderId;
    const { status } = req.body;
    Order.findByIdAndUpdate(
      orderId,
      { $set: { status: status } },
      { new: true }
    )
      .then((order) => res.status(200).json(order))
      .catch((err) => res.status(500).json(err));
  }
);

module.exports = router;
