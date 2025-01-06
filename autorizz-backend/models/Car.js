const mongoose = require('mongoose');

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
            name: String, // Name of the color (e.g., "Red")
            image: String, // URL to the image of the car in this color
        }
    ],
    // Added field for color options
    attachments: [String],  // Added field for attachments
});

const Car = mongoose.model('Car', carSchema);

module.exports = Car;
