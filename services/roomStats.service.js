const RoomStats = require('../models/RoomStats')

const saveRoomStats = async (temperature, humidity) => {
  const newRoomStats = new RoomStats({ temperature, humidity })
  await newRoomStats.save()
}

const getRoomStats = async () => {
  const roomStats = await RoomStats.find().sort({ createdAt: 'desc' }).limit(10)
  return roomStats
}

module.exports = { saveRoomStats, getRoomStats }