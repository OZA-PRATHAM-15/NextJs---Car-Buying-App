const mongoose = require('mongoose');

const cartAnalyticsSchema = new mongoose.Schema({
    carId: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    timestamp: { type: Date, default: Date.now },
});

const CartAnalytics = mongoose.model('CartAnalytics', cartAnalyticsSchema);
module.exports = CartAnalytics;
