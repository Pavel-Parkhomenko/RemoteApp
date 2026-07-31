// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const os = require('os');

require('dotenv').config();

const accessKey = process.env.UNSPLASH_ACCESS_KEY;

app.use('/img', express.static(path.join(__dirname, 'img')));
app.use(express.static(__dirname));
app.use(express.json());

let widthPhone = 500;
let heightPhone = 500;

let widthPc = 2560;
let heightPc = 1440;

const c_x = widthPc / 2;
const c_y = heightPc / 2;

// x-next,y-next,x-prev,y-prev,x-move,y-move
let DATA = [];
let resolutions = [];

function parseDATAfile() {
  if (!fs.existsSync('./DATA.json')) {
    const EXAMPLE = {
      player: 'video_0.com',
      coords: `1670,1100,100,100,${c_x},${c_y}`,
      isChecked: false,
    };

    fs.writeFileSync('DATA.json', JSON.stringify([EXAMPLE]), (err) => {});
  }

  try {
    const data = fs.readFileSync('./DATA.json', 'utf8');
    let dt = JSON.parse(data);
    for (let i = 0; i < dt.length; i++) {
      let player = dt[i].player;
      let coords = dt[i].coords;

      if (!player || player === '__NAME') throw new Error('Player name is invalid');
      if (!coords) throw new Error('Coords are invalid');

      let coordsArr = coords.split(',');
      let size = coordsArr.length;
      if (size === 6) continue;
      if (size < 4 || size === 5) throw new Error('Coords are invalid');
      if (size === 4) {
        coordsArr.push(c_x);
        coordsArr.push(c_y);

        dt[i].coords = coordsArr.join(',');
      }

      if (dt[i].isChecked) {
        fs.writeFile('coords.txt', coords, (err) => {
          if (err) res.status(400).send('Invalid command');
        });
      }
    }

    DATA = dt;
  } catch (err) {
    throw new Error(err.message);
  }
}

app.get('/', (_, res) => {
  res.sendFile(path.join(__dirname, '', 'index.html'));
});

app.get('/click-f', (_, res) => {
  fs.writeFile('command.txt', 'click-f', (err) => {
    if (err) res.status(400).send('Err: write file');
    else res.send(`click-f`);
  });
});

app.get('/not-cursor', (_, res) => {
  fs.writeFile('command.txt', 'not-cursor', (err) => {
    if (err) res.status(400).send('Err: write file');
    else res.send(`not-cursor`);
  });
});

app.get('/click-lkm', (_, res) => {
  fs.writeFile('command.txt', 'click-lkm', (err) => {
    if (err) res.status(400).send('Err: write file');
    else res.send(`click-lkm`);
  });
});

app.get('/center-cursor', (_, res) => {
  fs.writeFile('command.txt', 'center-cursor', (err) => {
    if (err) res.status(400).send('Err: write file');
    else res.send(`center-cursor`);
  });

  const coords = `${c_x},${c_y}`;

  fs.writeFile('ext_coords.txt', coords, (err) => {
    if (err) res.status(400).send('Err: write file');
  });
});

app.post('/free-cursor', (req, res) => {
  try {
    const { x, y } = req.body;

    const pcX = Math.round((y / heightPhone) * widthPc);
    const pcY = Math.round(((widthPhone - x) / widthPhone) * heightPc);

    const coords = `${pcX},${pcY}`;

    fs.writeFile('command.txt', 'free-cursor', (err) => {
      if (err) res.status(400).send('Invalid command');
      else res.send(`Free pos [${Math.round(pcX)}, ${Math.round(pcY)}]`);
    });

    fs.writeFile('ext_coords.txt', coords, (err) => {
      if (err) res.status(400).send('Err: write file');
    });
  } catch (err) {
    res.status(400).send('Free pos: err');
  }
});

app.get('/get-bg', async (req, res) => {
  const url = `https://api.unsplash.com/photos/random?client_id=${accessKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Ошибка: ${response.status}`);

    const data = await response.json();

    fs.writeFile('bgimg.txt', data.urls.regular, (err) => {
      if (err) res.status(400).send({ message: 'error' });
      else {
        res.status(200).send({
          img: data.urls.regular,
          message: 'update img successful',
        });
      }
    });
  } catch (error) {
    res.status(500).send({
      img: '',
      message: 'get-bg: Internal Server Error',
    });
  }
});

const validCommands = new Set([
  'pause',
  'next',
  'previous',
  'next-movie',
  'prev-movie',
  'volume-up',
  'volume-down',
  'rewind-right',
  'rewind-left',
]);

app.post('/check-server', (req, res) => {
  try {
    const { width, height } = req.body;
    widthPhone = width;
    heightPhone = height;

    parseDATAfile();

    writeCoordsByIsChecked();

    fs.readFile('resolution.json', 'utf8', (err, res) => {
      if (!err) {
        resolutions = JSON.parse(res);
        setResolutionPc();
      }
    });

    if (fs.existsSync('bgimg.txt')) {
      fs.readFile('bgimg.txt', 'utf8', (err, saveImg) => {
        if (err)
          return res.status(400).send({
            mess: 'Err load img!',
          });
        else {
          return res.status(200).send({
            mess: 'Server start successful!',
            videoPlayers: DATA,
            resolutions: resolutions,
            img: saveImg,
          });
        }
      });
    }
  } catch (err) {
    res.status(400).send({
      mess: err.message,
    });
  }
});

function writeCoordsByIsChecked() {
  DATA.map((item) => {
    if (item.isChecked) {
      fs.writeFile('coords.txt', item.coords, (err) => {
        if (err) res.status(400).send({ mess: 'writeCoordsByIsChecked' });
      });
      return;
    }
  });
}

function setResolutionPc() {
  resolutions.map((item) => {
    if (item.selected) {
      widthPc = item.width;
      heightPc = item.height;
      return;
    }
  });
}

let prevCommand = ['', 1];
app.get('/:command', (req, res) => {
  const { command } = req.params;

  if (!validCommands.has(command)) {
    return res.status(400).send('Invalid command');
  }

  if (prevCommand[0] == command) prevCommand[1]++;
  else {
    prevCommand[0] = command;
    prevCommand[1] = 1;
  }

  fs.writeFile('command.txt', command, (err) => {});

  return res.send(`${command} x${prevCommand[1]}`);
});

app.post('/change-player', (req, res) => {
  const { player } = req.body;
  let coords = '';

  DATA.map((item) => {
    if (item.player === player) {
      coords = item.coords;
      item.isChecked = true;
      return;
    } else item.isChecked = false;
  });

  if (coords === '') return res.status(400).send({ mess: 'Player is not found!' });

  fs.writeFile('DATA.json', JSON.stringify(DATA), (err) => {});

  fs.writeFile('coords.txt', coords, (err) => {
    if (err) res.status(400).send('Invalid command');
  });
});

app.post('/change-resolution', (req, res) => {
  const { resolution } = req.body;
  let choiceRes;

  resolutions.map((item) => {
    if (item.name === resolution) {
      item.selected = true;
      choiceRes = item;
      return;
    } else item.selected = false;
  });

  setResolutionPc();

  fs.writeFile('resolution.json', JSON.stringify(resolutions), (err) => {
    if (!err) res.status(200).send(`Выбрано ${choiceRes.width}/${choiceRes.height}`);
    else res.status(400).send('Err: resolution');
  });
});

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

app.listen(3000, () => console.log(`Server running on http://${getLocalIP()}:3000`));
