const express = require('express');
const app = express();
const fsPromise = require('fs').promises;
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

app.get("/canciones", async (req, res) => {
    if (checkIfFileExists(filePath)) {
        const songs = JSON.parse(await fsPromise.readFile("songs.json"));
        res.status(200).send(songs);
    } else {
        res.status(404).send("No songs found!");
    }
});

app.post("/canciones", async (req, res) => {
    const song = req.body;
    if (!validateSong(song)) {
        res.status(400).send("Invalid song!");
        return;
    } else {
        const songs = JSON.parse(await fsPromise.readFile("songs.json"));
        songs.push(song);
        await fsPromise.writeFile("songs.json", JSON.stringify(songs));
        res.status(200).send("Song added!");
    }
});

app.delete("/canciones/:id", async (req, res) => {
    // check if file exists
    if (!checkIfFileExists(filePath)) {
        res.status(404).send("Nothing to delete!");
        return;
    } else {
        const { id } = req.params;
        const songs = JSON.parse(await fsPromise.readFile("songs.json"));
        const index = songs.findIndex((s) => s.id == id);

        // if song not found
        if (index === -1) {
            res.status(404).send("Song not found!");
            return;
        } else {
            // if found
            songs.splice(index, 1);
            await fsPromise.writeFile("songs.json", JSON.stringify(songs));
            res.status(200).send("Song deleted!");
        }
    }
});

app.put("/canciones/:id", async (req, res) => {
    // check if file exists
    if (!checkIfFileExists(filePath)) {
        res.status(404).send("Nothing to update!");
        return;
    } else {
        const { id } = req.params;
        const song = req.body;
        const songs = JSON.parse(await fsPromise.readFile("songs.json"));
        const index = songs.findIndex((s) => s.id == id);

        // if song not found
        if (index === -1) {
            res.status(404).send("Song not found!");
            return;
        } else {
            // if found
            songs[index] = song;
            await fsPromise.writeFile("songs.json", JSON.stringify(songs));
            res.status(200).send("Song updated!");
        }

    }
});
