const express = require('express');
const router = express.Router();
const Car = require('../models/Car');

// Get all cars
router.get('/', async (req, res) => {
    try {
        const cars = await Car.find();
        res.json(cars);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
router.get('/type/:type', async (req, res) => {  // Correct route with /type/:type
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
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedCar = await Car.findByIdAndDelete(id);
        if (!deletedCar) {
            return res.status(404).json({ message: 'Car not found' });
        }
        res.status(200).json({ message: 'Car deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting car', error });
    }
});
router.post('/', async (req, res) => {
    const {
        name,
        description,
        image,
        price,
        type,
        available,
        engine,
        horsepower,
        fuel_type,
        transmission,
    } = req.body;

    // Check if required fields are provided
    if (!name || !description || !image || !price || !type) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    // Proceed to create a new car
    try {
        const newCar = new Car({
            name,
            description,
            image,
            price,
            type,
            available,
            specifications: {
                engine,
                horsepower,
                fuel_type,
                transmission,
            },
        });

        const savedCar = await newCar.save();
        res.status(201).json(savedCar);
    } catch (error) {
        console.error('Error adding new car:', error);
        res.status(500).json({ message: 'Error adding new car', error });
    }
});

module.exports = router;
