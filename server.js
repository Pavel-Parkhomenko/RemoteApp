// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use('/img', express.static(path.join(__dirname, 'img')));

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
    res.send("Next movie");
});

app.get('/prev-movie', (req, res) => {
    fs.writeFileSync('command.txt', 'prev-movie');
    res.send("Prev movie");
});

app.get('/volume-up', (req, res) => {
    fs.writeFileSync('command.txt', 'volume-up');
    res.send("Volume up");
});

app.get('/volume-down', (req, res) => {
    fs.writeFileSync('command.txt', 'volume-down');
    res.send("Volume down");
});


app.listen(3000, () => console.log('Server running on http://localhost:3000'));