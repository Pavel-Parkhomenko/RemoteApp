// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.get('/', (_, res) => {
    res.sendFile(path.join(__dirname, '', 'index.html'));
});

app.get('/pause', (req, res) => {
    fs.writeFileSync('command.txt', 'pause');
    res.send("Pause");
});

app.get('/next', (req, res) => {
    fs.writeFileSync('command.txt', 'next');
    res.send("Next");
});

app.get('/previous', (req, res) => {
    fs.writeFileSync('command.txt', 'previous');
    res.send("Prev");
});

app.get('/next-movie', (req, res) => {
    fs.writeFileSync('command.txt', 'next-movie');
    res.send("Next series");
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
//http://192.168.0.103:3000