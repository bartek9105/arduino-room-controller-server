const pixel = require("node-pixel");
const five = require("johnny-five");
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));

const board = new five.Board({ port: 'COM8' });
let strip = null;

board.on("ready", function() {
  strip = new pixel.Strip({
    board: this,
    controller: "FIRMATA",
    strips: [{ pin: 6, length: 30 }],
    gamma: 2.8,
  });

  this.repl.inject({
    strip: strip
  });
});

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

app.get('/rainbow', (req, res) => {
  var showColor;
  var cwi = 0; // colour wheel index (current position on colour wheel)
  var foo = setInterval(function() {
    if (++cwi > 255) {
      cwi = 0;
    }

    for (var i = 0; i < strip.length; i++) {
      showColor = colorWheel((cwi + i) & 255);
      strip.pixel(i).color(showColor);
    }
    strip.show();
  }, 1000 / 12);
})

function colorWheel(WheelPos) {
  var r, g, b;
  WheelPos = 255 - WheelPos;

  if (WheelPos < 85) {
    r = 255 - WheelPos * 3;
    g = 0;
    b = WheelPos * 3;
  } else if (WheelPos < 170) {
    WheelPos -= 85;
    r = 0;
    g = WheelPos * 3;
    b = 255 - WheelPos * 3;
  } else {
    WheelPos -= 170;
    r = WheelPos * 3;
    g = 255 - WheelPos * 3;
    b = 0;
  }
  // returns a string with the rgb value to be used as the parameter
  return "rgb(" + r + "," + g + "," + b + ")";
}

app.listen(3000, () => {
  console.log('Listening on port 3000');
});