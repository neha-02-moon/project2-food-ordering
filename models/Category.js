const { model, Schema } = require("mongoose");

module.exports = model(
  "Category",
  new Schema({
    name: { type: String, unique: true },
    image: { type: String },
  })
);
