const express = require('express');

const FilterAnalytics = require('../models/FilterAnalytics');
const router = express.Router();

// Log hover analytics
const HoverAnalytics = require('../models/HoverAnalytics');

// Store hover event
router.post('/hover', async (req, res) => {
    const { carId } = req.body;

    try {
        // Check for existing hover event
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

// Log filter analytics
router.post('/filter', async (req, res) => {
    const { filters } = req.body;

    try {
        // Search for an existing filter combination
        const existingAnalytics = await FilterAnalytics.findOne({ filters });

        if (existingAnalytics) {
            // Increment the count if the filters already exist
            existingAnalytics.count += 1;
            await existingAnalytics.save();
        } else {
            // Create a new entry if it doesn't exist
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

module.exports = router;
