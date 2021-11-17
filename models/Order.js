const { model, Schema } = require("mongoose");

module.exports = model(
  "Order",
  new Schema({
    items: { type: [String] },
  })
);
