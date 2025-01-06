const express = require('express');
const router = express.Router();

const HoverAnalytics = require('../models/HoverAnalytics');
const FilterAnalytics = require('../models/FilterAnalytics');
const Car = require('../models/Car');
const { authenticateUser } = require('../middlewares/authenticateUser');
const CartAnalytics = require('../models/CartAnalytics');


// Existing hover analytics route
router.post('/hover', async (req, res) => {
    const { carId } = req.body;

    try {
        const existingHover = await HoverAnalytics.findOne({ carId });

        if (!existingHover) {
            const newHover = new HoverAnalytics({ carId, count: 1 });
            await newHover.save();
        } else {
            existingHover.count += 1;
            await existingHover.save();
        }

        res.status(200).json({ message: 'Hover event recorded successfully.' });
    } catch (error) {
        console.error('Error storing hover analytics:', error);
        res.status(500).json({ message: 'Failed to record hover event.' });
    }
});

// Existing filter analytics route
router.post('/filter', async (req, res) => {
    const { filters } = req.body;

    try {
        const existingAnalytics = await FilterAnalytics.findOne({ filters });

        if (existingAnalytics) {
            existingAnalytics.count += 1;
            await existingAnalytics.save();
        } else {
            const newAnalytics = new FilterAnalytics({
                filters,
                count: 1,
            });
            await newAnalytics.save();
        }

        res.status(200).json({ message: 'Filter analytics logged successfully.' });
    } catch (error) {
        console.error('Error saving filter analytics:', error);
        res.status(500).json({ message: 'Failed to save filter analytics.' });
    }
});

// New route for category-wise hover distribution
router.get('/hover/category', async (req, res) => {
    try {
        const categoryHoverData = await HoverAnalytics.aggregate([
            {
                $lookup: {
                    from: 'cars', // Collection name
                    localField: 'carId',
                    foreignField: '_id',
                    as: 'car',
                },
            },
            { $unwind: '$car' },
            {
                $group: {
                    _id: '$car.type',
                    totalHoverCount: { $sum: '$count' },
                },
            },
        ]);

        res.status(200).json(categoryHoverData);
    } catch (error) {
        console.error('Error fetching category-wise hover analytics:', error);
        res.status(500).json({ message: 'Failed to fetch data.' });
    }
});
router.get('/hover/most', async (req, res) => {
    try {
        const mostHovered = await HoverAnalytics.aggregate([
            {
                $lookup: {
                    from: 'cars', // Cars collection
                    localField: 'carId',
                    foreignField: '_id',
                    as: 'car',
                },
            },
            { $unwind: '$car' },
            { $sort: { count: -1 } }, // Sort by hover count descending
            { $limit: 10 }, // Limit to top 10
            {
                $project: {
                    carName: '$car.name',
                    totalHoverCount: '$count',
                },
            },
        ]);

        res.status(200).json(mostHovered);
    } catch (error) {
        console.error('Error fetching most-hovered products:', error);
        res.status(500).json({ message: 'Failed to fetch data.' });
    }
});
router.get('/hover/least', async (req, res) => {
    try {
        const leastHovered = await HoverAnalytics.aggregate([
            {
                $lookup: {
                    from: 'cars',
                    localField: 'carId',
                    foreignField: '_id',
                    as: 'car',
                },
            },
            { $unwind: '$car' },
            { $sort: { count: 1 } }, // Sort by hover count ascending
            { $limit: 10 }, // Limit to bottom 10
            {
                $project: {
                    carName: '$car.name',
                    totalHoverCount: '$count',
                },
            },
        ]);

        res.status(200).json(leastHovered);
    } catch (error) {
        console.error('Error fetching least-hovered products:', error);
        res.status(500).json({ message: 'Failed to fetch data.' });
    }
});
router.get('/hover/overview', async (req, res) => {
    try {
        const totalHovers = await HoverAnalytics.aggregate([
            { $group: { _id: null, total: { $sum: '$count' } } },
        ]);

        const topHovered = await HoverAnalytics.aggregate([
            {
                $lookup: {
                    from: 'cars',
                    localField: 'carId',
                    foreignField: '_id',
                    as: 'car',
                },
            },
            { $unwind: '$car' },
            { $sort: { count: -1 } },
            { $limit: 1 },
            { $project: { carName: '$car.name', totalHoverCount: '$count' } },
        ]);

        const totalCategories = await HoverAnalytics.aggregate([
            {
                $lookup: {
                    from: 'cars',
                    localField: 'carId',
                    foreignField: '_id',
                    as: 'car',
                },
            },
            { $unwind: '$car' },
            { $group: { _id: '$car.type' } },
            { $count: 'categories' },
        ]);

        res.status(200).json({
            totalHovers: totalHovers[0]?.total || 0,
            topHoveredProduct: topHovered[0]?.carName || 'N/A',
            totalCategories: totalCategories[0]?.categories || 0,
        });
    } catch (error) {
        console.error('Error fetching dashboard overview:', error);
        res.status(500).json({ message: 'Failed to fetch data.' });
    }
});
router.get('/hover/zero', async (req, res) => {
    try {
        const carsWithoutHovers = await Car.aggregate([
            {
                $lookup: {
                    from: 'hoveranalytics', // Join with HoverAnalytics collection
                    localField: '_id',
                    foreignField: 'carId',
                    as: 'hoverData',
                },
            },
            {
                $match: { hoverData: { $size: 0 } }, // Filter cars with no hover data
            },
        ]);

        res.status(200).json(carsWithoutHovers);
    } catch (error) {
        console.error('Error fetching products with zero hovers:', error);
        res.status(500).json({ message: 'Failed to fetch data.' });
    }
});


router.post('/add-to-cart', authenticateUser, async (req, res) => {
    const { carId } = req.body;

    if (!carId) {
        return res.status(400).json({ message: 'Car ID is required' });
    }

    try {
        // Use userId from the authenticated user
        const userId = req.user.userId;

        await CartAnalytics.create({ carId, userId });
        res.status(201).json({ message: 'Add to cart action logged successfully' });
    } catch (error) {
        console.error('Error logging add-to-cart action:', error);
        res.status(500).json({ message: 'Failed to log action', error });
    }
});




module.exports = router;
