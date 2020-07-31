const { Schema } = require("mongoose");
const mongooose = require("mongoose");

const coderSchema = new Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  otp: {
    type: Number,
  },
  status: {
    type: Boolean,
    default: false,
  },
  room: {
    type: String,
  },
});

mongooose.model("Coder", coderSchema);
