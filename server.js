import express from 'express';
import dotenv from "dotenv";
import cors from "cors";
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import path from "path";
import connectToMongoDB from './db/connectToMongoDB.js';
import { uploadSongAndCover } from "./middleware/s3upload.js"

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 5000;

// Setup mongoDB connection here
(async () => {
    try {
        await connectToMongoDB();
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
    }
})();

// Song schema here

const songSchema = new mongoose.Schema({
    title: String,
    artist: String,
    album: String,
    albumCoverPath: String,
    filePath: String,
});

const Song = mongoose.model("Song", songSchema);

// API to upload a song and cover photo
app.post("/api/songs", uploadSongAndCover, async (req, res) => {
    try {
        // console.log(req.files); // Add this line to see the files being uploaded
        // console.log(req.body);

        const newSong = new Song({
            title: req.body.title,
            artist: req.body.artist,
            album: req.body.album,
            albumCoverPath: req.body.albumCoverUrl,
            filePath: req.body.songFileUrl,
        });

        const savedSong = await newSong.save();
        res.json(savedSong);
    } catch (err) {
        res.status(500).json({ error: "Failed to save song" });
    }
});

// API to fetch songs
app.get("/api/songs", async (req, res) => {
    try {
        const songs = await Song.find();
        console.log(songs);
        res.json(songs);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch songs" });
    }
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
