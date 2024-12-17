const mongoose = require('mongoose');

const FilterAnalyticsSchema = new mongoose.Schema({
    filters: { type: Object, required: true }, // JSON object of filter conditions
    count: { type: Number, default: 1 },       // Number of times the filter was applied
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('FilterAnalytics', FilterAnalyticsSchema);
