require('dotenv').config()
const pixel = require("node-pixel");
const five = require("johnny-five");
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const WebSocket = require('ws');
const dbConnection = require('./db');
const { getRoomStats, saveRoomStats } = require('./services/roomStats.service');

const Readline = require('@serialport/parser-readline');
const SerialPort = require('serialport')
const port = new SerialPort('COM8', {
  baudRate: 9600
})
const parser = port.pipe(new Readline({ delimiter: '\n' }));

const app = express();
const server = require('http').createServer(app)

dbConnection();

const ws = new WebSocket.Server({ server })

app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));

ws.on('connection', function connection(ws) {
  console.log('New client connected')
  parser.on('data', async function(data) {
    console.log(data)
    const [humidity, temperature] = data.split(',')
    await saveRoomStats(temperature, humidity)
    ws.send(data)
  })
})

let strip = null;
const board = new five.Board({ port: "COM9" })

board.on("ready", function() {
  strip = new pixel.Strip({
    board: board,
    controller: "FIRMATA",
    strips: [{ pin: 6, length: 30 }],
    gamma: 2.8,
  });

  this.repl.inject({
    strip: strip
  });
})

app.post('/led', (req, res) => {
  const { color } = req.body;
  strip.color(color);
  strip.show();
  res.send({ color });
})

app.post('/led/status', (req, res) => {
  const { status } = req.body

  if (status) {
    strip.color('#A9E5BB');
    strip.show();
    res.send({ message: 'LED turned on' })
  } else {
    strip.off()
    res.send({ message: 'LED turned off' })
  }
})

app.get('/room-stats', async (req, res) => {
  const roomStats = await getRoomStats()
  res.send(roomStats)
})

server.listen(3000, () => {
  console.log('Listening on port 3000');
});