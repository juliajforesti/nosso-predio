const express = require("express");
const router = express.Router();
const Building = require("../models/building");
const User = require("../models/user");
const mongoose = require("mongoose");
const uploader = require("../configs/cloudinary");

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
  if (Object.keys(req.body).length === 0) {
    res.status(400).json({ message: "no body provided" });
    return;
  }

  const characters =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let token = "";
  for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }
  const confirmationCode = token;
  const { name, cep, number } = req.body;
  console.log("USER EH ----------->", req.user);

  Building.create({
    name,
    address: {
      cep,
      number,
    },
    confirmationCode,
    residents: [req.user._id],
    image:
      "https://res.cloudinary.com/juliajforesti/image/upload/v1589218713/nosso-predio/user_cqrmt0.png",
    owner: req.user._id,
  })
    .then((building) => {
      User.findByIdAndUpdate(
        req.user._id,
        { $push: { buildings: building } },
        { new: true }
      )
        .then((response) => res.json(response))
        .catch((err) => {
          res.status(500).json(err);
        });
      res.json(building);
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

  Building.findByIdAndUpdate(
    buildingId,
    { $set: { name, address } },
    { new: true }
  )
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

router.post(
  "/edit-building-photo/:id",
  uploader.single("image"),
  (req, res, next) => {
    const buildingId = req.params.id;

    const image = req.file.secure_url;

    Building.findByIdAndUpdate(buildingId, { $set: { image } }, { new: true })
      .then((response) => {
        res.json(response);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  }
);

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

// Confirmation code
router.get("/building-invitation/:confirmCode", (req, res, next) => {
  const { confirmCode } = req.params;

  Building.findOne({ confirmationCode: confirmCode })
    .then((theBuilding) => {
      if (theBuilding.residents.includes(req.user._id)) {
        res.status(200).json(theBuilding);
      } else {
        Building.findOneAndUpdate(
          { confirmationCode: confirmCode },
          { $push: { residents: req.user._id } },
          { new: true }
        ).then((building) => {
          User.findByIdAndUpdate(
            req.user._id,
            { $push: { buildings: building } },
            { new: true }
          )
            .then((response) => res.json(response))
            .catch((err) => {
              res.status(500).json(err);
            });
          res.json(building);
        });
      }
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

module.exports = router;
