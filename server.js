// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use('/img', express.static(path.join(__dirname, 'img')));

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
	'rewind-left'
]);

app.get('/:command', (req, res) => {
	const { command } = req.params;

	if (!validCommands.has(command)) {
		return res.status(400).send('Invalid command');
	}

	fs.writeFileSync('command.txt', command);
	res.send(`${command} 🍻`);
});


app.listen(3000, () => console.log('Server running on http://localhost:3000'));