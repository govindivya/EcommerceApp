const mongoose = require("mongoose");
const validator = require("validator");

const deletedUserSchema = new mongoose.Schema({

  email: {
    type: String,
    required: [true, "Please Enter Your Email"],
    validate: [validator.isEmail, "Please Enter a valid Email"],
    unique: true,
  },
  deletedAt:{
      type:Date,
      default:Date.now()
  }
});


module.exports = mongoose.model("DeletedUser",deletedUserSchema)



