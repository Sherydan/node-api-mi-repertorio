const express = require('express');
const app = express();
const fsPromises = require('fs').promises;
const filePath = './songs.json';

app.listen(3000, console.log('Listening on port 3000!'));

app.use(express.json());

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

const checkIfFileExists = async (filePath) => {
    try {
        //check if exists
        await fsPromise.access(filePath);
        return true;
    } catch (err) {
        // create if not exists
        await fsPromise.writeFile(filePath, JSON.stringify([]));
    }
};

const validateSong = (song) => {
    const { id, titulo, artista, tono } = song;
    // all fields are required
    if (
        id.length === 0 ||
        titulo.length === 0 ||
        artista.length === 0 ||
        tono.length === 0
    ) {
        return false;
    }
    return true;
};
