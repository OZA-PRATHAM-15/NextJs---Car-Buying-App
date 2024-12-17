const mongoose = require('mongoose');

const HoverAnalyticsSchema = new mongoose.Schema({
    carId: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
    count: { type: Number, default: 1 },
});

module.exports = mongoose.model('HoverAnalytics', HoverAnalyticsSchema);
