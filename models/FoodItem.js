const { model, Schema } = require("mongoose");

module.exports = model(
  "FoodItem",
  new Schema({
    category: { type: String },
    name: { type: String, unique: true },
    image: { type: String },
    price: { type: String },
    description: { type: String },
  })
);
