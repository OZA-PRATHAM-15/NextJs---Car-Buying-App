const mongoose = require('mongoose');

const carVisitAnalyticsSchema = new mongoose.Schema({
    carId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Car',
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false, // Optional if not always logged in
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

const CarVisitAnalytics = mongoose.model('CarVisitAnalytics', carVisitAnalyticsSchema);

module.exports = CarVisitAnalytics;
