const express = require("express");
const router = express.Router();
const Building = require("../models/building");
const Service = require("../models/service");
const User = require("../models/user");

//GET ALL SERVICES
router.get("/services", (req, res) => {
  Service.find()
    .then((service) => {
      res.status(200).json(service);
    })
    .catch((err) => res.status(500).json(err));
});

//GET SPECIFIC SERVICE
router.get("/building/:buildingId/service/:serviceId", (req, res) => {
  const serviceId = req.params.serviceId;

  Service.findById(serviceId)
    .then((service) => {
      res.status(200).json(service);
    })
    .catch((err) => res.status(500).json(err));
});

router.get("/building/:buildingId/service-owner/:serviceId", (req, res) => {
  const serviceId = req.params.serviceId;

  Service.findById(serviceId)
    .populate("orders")
    .then((service) => {
      res.status(200).json(service);
    })
    .catch((err) => res.status(500).json(err));
});

router.post("/building/:buildingId/add-service", (req, res) => {
  const buildingId = req.params.buildingId;

  const { name, description, price, category, apartment, date } = req.body;

  Service.create({
    name,
    description,
    price,
    category,
    apartment,
    date,
    owner: req.user._id,
    building: buildingId
  })
    .then((service) => {
      Building.findByIdAndUpdate(
        buildingId,
        { $push: { services: service } },
        { new: true }
      )
        .then((response) => {
          User.findByIdAndUpdate(
            req.user._id,
            { $push: { services: service } },
            { new: true }
          )
            .then((resp) => res.status(200).json(resp))
            .catch((err) => res.status(500).json(err));
        })
        .catch((err) => res.status(500).json(err));
    })
    .catch((err) => res.status(500).json(err));
});

router.post("/building/:buildingId/edit-service/:serviceId", (req, res) => {
  const serviceId = req.params.serviceId;

  const { name, description, price, category, apartment, date } = req.body;

  Service.findByIdAndUpdate(
    serviceId,
    {
      $set: { name, description, price, category, apartment, date },
    },
    { new: true }
  )
    .then((service) => {
      res.status(200).json(service);
    })
    .catch((err) => res.status(500).json(err));
});

router.delete("/building/:buildingId/delete-service/:serviceId", (req, res) => {
  const serviceId = req.params.serviceId;

  Service.findByIdAndRemove(serviceId)
    .then((response) => {
      res.json({
        message: `Service with ${serviceId} is removed successfully.`,
      });
    })
    .catch((err) => res.status(500).json(err));
});

module.exports = router;
