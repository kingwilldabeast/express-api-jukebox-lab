const express = require('express')
const bodyParser = require(`body-parser`)
const mongoose = require('mongoose');
const { Schema } = require('mongoose')

// const cors = require('cors');
// const logger = require(`morgan`)

const app = express()
app.use(bodyParser.json());
// app.use(cors());
// app.use(logger(`dev`))
// app.use(express.json())

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`))

mongoose
    .connect('mongodb://127.0.0.1:27017/jukeboxDatabase') //replace DATABASE_NAME with the actual name of database. only thing that changes
    .then(() => {
        console.log('Successfully connected to MongoDB.')
      })
      .catch((e) => console.error('Connection error', e.message))

mongoose.set('debug',true)
const db = mongoose.connection;

// Define a Mongoose schema and model
const TrackSchema = new Schema({
    title: { type: String, required: true },
    artist: { type: String, required: true },
  });
  
  const Track = mongoose.model('Track', TrackSchema);

  module.exports = {db, Track};
  

  const createTrack = async (req, res) => {
    try {
        const newObject = await new Track(req.body)
        await newObject.save()
        return res.status(201).json({
            newObject,
        });
    } catch (error) {
        // if (error.name === 'CastError' && error.kind === 'ObjectId') {
        //     return res.status(404).send(`That Track doesn't exist`)
        // }
        return res.status(500).json({ error: error.message })
    }
}

const getAllTracks = async (req, res) => {
    try {
        const objectArray = await Track.find()
        res.json(objectArray)
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

const getTrackById = async (req, res) => {
    try {
        const { id } = req.params
        const singleObject = await Track.findById(id)
        if (singleObject) {
            return res.json(singleObject)
        }
        return res.status(404).send(`that track doesn't exist`)
    } catch (error) {
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
            return res.status(404).send(`That track doesn't exist`)
        }
        return res.status(500).send(error.message);
    }
}

//update
const updateTrack = async (req, res) => {
    try {
        let { id } = req.params;
        let changedObject = await Track.findByIdAndUpdate(id, req.body, { new: true })
        if (changedObject) {
            return res.status(200).json(changedObject)
        }
        throw new Error("Track not found and can't be updated")
    } catch (error) {
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
            return res.status(404).send(`That Track doesn't exist`)
        }
        return res.status(500).send(error.message);
    }
}

const deleteTrack = async (req, res) => {
    try {
        const { id } = req.params;
        const erasedObject = await Track.findByIdAndDelete(id)
        if (erasedObject) {
            return res.status(200).send("Track deleted");
        }
        throw new Error("Track not found and can't be deleted");
    } catch (error) {
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
            return res.status(404).send(`That Track doesn't exist`)
        }
        return res.status(500).send(error.message);
    }
}

app.get('/', (req, res) => res.send('This is our landing page!'))
app.post('/tracks', createTrack);
app.get('/tracks', getAllTracks)
app.get('/tracks/:id', getTrackById);
app.put('/tracks/:id', updateTrack);
app.delete('/tracks/:id', deleteTrack);
app.get('*', (req, res) => res.send('404 page not found'))
