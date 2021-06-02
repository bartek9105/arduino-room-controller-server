const mongoose = require('mongoose');

const RoomStatsSchema = new mongoose.Schema({
  temperature: {
    type: String
  },
  humidity: {
    type: String
  },
}, { timestamps: true })

module.exports = mongoose.model('RoomStats', RoomStatsSchema);
