const express = require('express');
const app = express();
const fsPromises = require('fs').promises;
const filePath = './songs.json';

app.listen(3000, console.log('Listening on port 3000!'));

app.use(express.json());

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});


