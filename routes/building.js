const express = require("express");
const router = express.Router();
const Building = require("../models/building");
const mongoose = require("mongoose");

// GET BUILDING
router.get(`/buildings`, (req, res, next) => {
  const cep = req.query.cep;
  const number = req.query.number;

  Building.find()
    .then((building) => res.json(building))
    .catch((error) => res.status(500).json(error));
});

// GET BUILDING DETAILS
router.get("/building/:id", (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  // services are being populated
  Building.findById(req.params.id)
    // .populate("services")
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      res.json(err);
    });
});

// POST route => to create a new building
router.post("/add-building", (req, res, next) => {
  // checks if body was provided
  if (Object.keys(req.body).length === 0) {
    res.status(400).json({ message: "no body provided" });
    return;
  }

  const { name, cep, number } = req.body;

  Building.create({
    name,
    address: {
      cep,
      number,
    },
    image:
      "https://res.cloudinary.com/juliajforesti/image/upload/v1589218713/nosso-predio/user_cqrmt0.png",
    owner: req.user._id,
  })
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// EDIT BUILDING
router.post("/edit-building/:id", (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }
  const buildingId = req.params.id;
  const { name, cep, number } = req.body;
  const address = { cep, number };

  Building.findByIdAndUpdate(buildingId, { $set: { name, address } })
    .then(() => {
      res.json({
        message: `Building with ${req.params.id} is updated successfully.`,
      });
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// DELETE route => to delete a specific building
router.delete("/delete-building/:id", (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Building.findByIdAndRemove(req.params.id)
    .then(() => {
      res.json({
        message: `Building with ${req.params.id} is removed successfully.`,
      });
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

module.exports = router;

