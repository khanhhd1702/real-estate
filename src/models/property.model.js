const mongoose = require("mongoose");

const statusEnum = ["active", "inactive"];

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true, minlength: 10 },
  price: {
    max: { type: Number, required: true },
    min: { type: Number },
  },
  address: { type: String, required: true, minlength: 10 },
  image: { type: Array[String], required: true, minlength: 1 },
  status: { type: String, enum: statusEnum, default: "active" },
  created: { type: Date, default: new Date() },
});

module.exports = mongoose.model("Property", propertySchema);
