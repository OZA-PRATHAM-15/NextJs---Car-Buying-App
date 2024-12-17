const express = require('express');
const router = express.Router();
const Car = require('../models/Car');
const HoverAnalytics = require('../models/HoverAnalytics');
const FilterAnalytics = require('../models/FilterAnalytics');

// Get all cars with filters
router.get('/', async (req, res) => {
    const { search, type, minPrice, maxPrice } = req.query;
    const filter = {};

    if (search) {
        filter.$or = [
            { name: new RegExp(search, 'i') },
            { description: new RegExp(search, 'i') },
        ];
    }

    if (type) {
        filter.type = type;
    }

    if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = parseInt(minPrice, 10);
        if (maxPrice) filter.price.$lte = parseInt(maxPrice, 10);
    }

    try {
        const cars = await Car.find(filter);
        res.json(cars);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching cars', error: err });
    }
});

// Get cars by type
// Get cars by type with filters
router.get('/type/:type', async (req, res) => {
    const carType = req.params.type;
    const { minPrice, maxPrice, fuel, transmission, search } = req.query;

    try {
        let filterQuery = { type: carType };

        if (minPrice) filterQuery.price = { $gte: Number(minPrice) };
        if (maxPrice) filterQuery.price = { ...filterQuery.price, $lte: Number(maxPrice) };
        if (fuel) filterQuery['specifications.fuel_type'] = fuel; // Check this key
        if (transmission) filterQuery['specifications.transmission'] = transmission;
        if (search) {
            filterQuery.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // DEBUGGING

        const cars = await Car.find(filterQuery);

        if (cars.length === 0) {
            return res.status(404).json({ message: `No cars found matching your filters.` });
        }

        res.json(cars);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});



// Add new car
router.post('/', async (req, res) => {
    const { name, description, image, price, type, available, engine, horsepower, fuel_type, transmission } = req.body;

    if (!name || !description || !image || !price || !type) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const newCar = new Car({
            name,
            description,
            image,
            price,
            type,
            available,
            specifications: { engine, horsepower, fuel_type, transmission },
        });

        const savedCar = await newCar.save();
        res.status(201).json(savedCar);
    } catch (error) {
        res.status(500).json({ message: 'Error adding new car', error });
    }
});

// Delete car
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

// Log hover analytics
router.post('/hover', async (req, res) => {
    const { carId, userId } = req.body;

    try {
        const hoverExists = await HoverAnalytics.findOne({
            carId,
            userId,
            timestamp: { $gt: new Date(Date.now() - 6 * 1000) },
        });

        if (!hoverExists) {
            await HoverAnalytics.create({ carId, userId });
            res.status(201).json({ message: 'Hover event logged' });
        } else {
            res.status(200).json({ message: 'Hover event already logged' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to log hover event', error });
    }
});

// Log filter analytics
router.post('/filter', async (req, res) => {
    const { filters, userId } = req.body;

    try {
        await FilterAnalytics.create({ filters, userId });
        res.status(201).json({ message: 'Filter event logged' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to log filter event', error });
    }
});

module.exports = router;
