const mongoose = require("mongoose");

const IotDevice = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true,
  },

  temperature: {
    type: Number,
    required: true,
  },

  timestamp: {
    type: Number,
    default: () => Date.now(),
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Devicedata = mongoose.model("Devicedata", IotDevice);

module.exports = Devicedata;