const mongoose = require("mongoose");

const refundSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model("Refund", refundSchema);
