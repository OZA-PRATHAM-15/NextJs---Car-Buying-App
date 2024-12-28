const mongoose = require('mongoose');

const hoverAnalyticsSchema = new mongoose.Schema({
    carId: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
    count: { type: Number, default: 0 },
    timestamp: { type: Date, default: Date.now }, // Add timestamp field
});

module.exports = mongoose.model('HoverAnalytics', hoverAnalyticsSchema);
