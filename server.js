// server.js
const express = require('express')
const fs = require('fs')
const path = require('path')
const app = express()
const os = require('os')

require('dotenv').config();

const accessKey = process.env.UNSPLASH_ACCESS_KEY;

app.use('/img', express.static(path.join(__dirname, 'img')));
app.use(express.json());

app.get('/', (_, res) => {
	res.sendFile(path.join(__dirname, '', 'index.html'));
});

app.get('/get-bg', async (req, res) => {
	const url = `https://api.unsplash.com/photos/random?client_id=${accessKey}`

	try {
		const response = await fetch(url);
		if (!response.ok) throw new Error(`Ошибка: ${response.status}`);
	
		const data = await response.json();
		console.log('Фото:', data.urls.full);
		res.status(200).send({
			img: data.urls.full,
			message: "update img successful"
		})
	  } catch (error) {
		console.error('Ошибка запроса:', error.message);
		res.status(500).send({
			img: "",
			message: "get-bg: Internal Server Error"
		})
	  }
})

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

app.get('/check-server', (req, res) => {
	fs.writeFileSync('coords.txt', DATA[0].coords);
	return res.status(200).send({
		mess: 'Server start successful!',
		videoPlayers: DATA,
	})
})


let prevCommand = ['', 1]
app.get('/:command', (req, res) => {
	const { command } = req.params

	if (!validCommands.has(command)) {
		return res.status(400).send('Invalid command')
	}

	if(prevCommand[0] == command) prevCommand[1]++
	else {
		prevCommand[0] = command
		prevCommand[1] = 1
	}

	fs.writeFileSync('command.txt', command);
	res.send(`${command} x${prevCommand[1]}`)
})

// x-next,y-next,x-prev,y-prev
const DATA = [
	{
		player: 'kinogo-go.tv_2',
		coords: '1630,1053,1600,1053',
		isChecked: true,
	},
	{
		player: 'anwap_1',
		coords: '127,1044,90,1044',
		isChecked: false,
	},
]

app.post('/change-player', (req, res) => {
	const { player } = req.body
	let coords = ''

	DATA.map(item => {
		if(item.player === player) {
			coords = item.coords
			item.isChecked = true
			return
		} else item.isChecked = false
	})

	if(coords === '') return req.status(400).send('Player is not found!')

	fs.writeFileSync('coords.txt', coords);
})

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