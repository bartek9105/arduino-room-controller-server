const mongoose = require('mongoose');

const RoomLogsSchema = new mongoose.Schema({
  action: {
    type: String
  },
}, { timestamps: true })

module.exports = mongoose.model('RoomLogs', RoomLogsSchema);
