const mongoose = require("mongoose");

const ratingSchema = mongoose.Schema({
  user_id: { type: String, required: true },
  rater_id: { type: String, required: true },
  star: {
    type: Number,
    required: true,
    validate: {
      validator: function (val) {
        if (val <= 5 && val >= 1) {
          return val;
        }
      },
      message: "Star must be between 0 and 5",
    },
  },
  comment: { type: String, required: true, maxlength: 255 },
});

module.exports = mongoose.model("Rating", ratingSchema);
