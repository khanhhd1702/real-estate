const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  propertyId: { type: Array[String] },
});

module.exports = mongoose.model("Favorite", favoriteSchema);
