// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use('/img', express.static(path.join(__dirname, 'img')));
app.use(express.json());

app.get('/', (_, res) => {
	res.sendFile(path.join(__dirname, '', 'index.html'));
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

app.get('/check-server', (req, res) => {
	return res.status(200).send('Server start successful!')
})

app.get('/:command', (req, res) => {
	const { command } = req.params

	if (!validCommands.has(command)) {
		return res.status(400).send('Invalid command')
	}

	fs.writeFileSync('command.txt', command);
	res.send(`${command} 🍻`)
})

// x-next,y-next,x-prev,y-prev
const DATA = [
	{
		player: 'anwap_1',
		coords: '1689,1053,1653,1053'
	},
	{
		player: 'kinogo-go.tv_2',
		coords: '127,1044,90,1044'
	}
]

app.post('/change-player', (req, res) => {
	const { player } = req.body
	let coords = ''

	DATA.map(item => {
		if(item.player === player) {
			coords = item.coords
			return
		}
	})

	if(coords === '') return req.status(400).send('Player is not found!')

	fs.writeFileSync('coords.txt', coords);
})


app.listen(3000, () => console.log('Server running on http://localhost:3000'));