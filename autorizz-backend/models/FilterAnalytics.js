const mongoose = require("mongoose");
const filterAnalyticsSchema = new mongoose.Schema({
  filters: { type: Map, of: String },
  count: { type: Number, default: 0 },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("FilterAnalytics", filterAnalyticsSchema);
