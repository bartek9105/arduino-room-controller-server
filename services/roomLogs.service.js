const RoomStats = require('../models/RoomLogs')

const saveRoomLogs = async (action) => {
  const newRoomLog = new RoomStats({ action })
  await newRoomLog.save()
}

const getRoomLogs = async () => {
  const roomLogs = await RoomLogs.find().sort({ createdAt: 'desc' }).limit(10)
  return roomLogs
}

module.exports = { saveRoomLogs, getRoomLogs }