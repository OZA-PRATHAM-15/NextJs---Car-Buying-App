const express = require('express');
const router = express.Router();
const Car = require('../models/Car');

// Get all cars
router.get('/cars', async (req, res) => {
    try {
        const cars = await Car.find();
        res.json(cars);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
router.get('/cars/type/:type', async (req, res) => {  // Correct route with /type/:type
    const carType = req.params.type;

    try {
        const cars = await Car.find({ type: carType });
        if (cars.length === 0) {
            return res.status(404).json({ message: `No cars found for type: ${carType}` });
        }
        res.json(cars);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
module.exports = router;
