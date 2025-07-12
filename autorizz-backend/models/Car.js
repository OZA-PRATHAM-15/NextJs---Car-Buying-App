const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  available: {
    type: Boolean,
    default: true,
  },
  features: [String],
  date_added: {
    type: Date,
    default: Date.now,
  },
  specifications: {
    engine: String,
    horsepower: Number,
    fuel_type: String,
    transmission: String,
  },
  colors: [
    {
      name: String,
      image: String,
    },
  ],
  attachments: [String],
});

const Car = mongoose.model("Car", carSchema);

module.exports = Car;
