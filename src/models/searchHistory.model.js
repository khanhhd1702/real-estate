const mongoose = require("mongoose");

const searchHistorSchema = mongoose.Schema({
  userId: { type: String, required: true },
  search_terms: { type: Array[String] },
});

module.exports = mongoose.model("SearchHistory", searchHistorySchema);
