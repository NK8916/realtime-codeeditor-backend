const { Schema } = require("mongoose");
const mongooose = require("mongoose");

const coderSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
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
