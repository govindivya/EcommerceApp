const mongoose = require("mongoose");

const deletedProductSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter product Name"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please Enter product Description"],
  },
  price: {
    type: Number,
    required: [true, "Please Enter product Price"],
    maxLength: [8, "Price cannot exceed 8 characters"],
  },
  images: [{
      type:String,
  }],

  deletedAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("DeletedProduct", deletedProductSchema);
