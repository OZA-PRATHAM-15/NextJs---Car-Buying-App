const mongoose = require('mongoose');
const filterAnalyticsSchema = new mongoose.Schema({
    filters: { type: Map, of: String }, // Assuming filters are stored as key-value pairs
    count: { type: Number, default: 0 },
    timestamp: { type: Date, default: Date.now }, // Add timestamp field
});

module.exports = mongoose.model('FilterAnalytics', filterAnalyticsSchema);
