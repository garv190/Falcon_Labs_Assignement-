const express = require("express");
const router = express.Router();
const Devicedata = require("../models/devicedeta.js");
const mongoose = require("mongoose");

router.post("/ingest", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: "Database not connected" });
    }

    const { deviceId, temperature, timestamp } = req.body;

    if (!deviceId || temperature === undefined) {
      return res.status(400).json({ message: "deviceId and temperature are required" });
    }

    const reading = await Devicedata.create({
      deviceId,
      temperature,
      timestamp: timestamp || Date.now(),
    });

    res.status(201).json(reading);
  } catch (error) {
    console.error('Error saving sensor reading:', error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/:deviceId/latest", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: "Database not connected" });
    }

    const { deviceId } = req.params;

    const data = await Devicedata.findOne({ deviceId }).sort({ timestamp: -1 });

    if (!data) {
      return res.status(404).json({ message: "No readings" });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Error in getting sensor reading:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;