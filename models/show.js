const mongoose = require('mongoose');

const showSchema = new mongoose.Schema({
     title: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    releaseDate: {
        type: Date,
        required: true
    },
    averageRunTime: {
        type: Number,
        required: true
    },
    numOfSeasons: {
      type: Number,
      required: true
    },
    averageNumOfEpisodesPerSeason: {
      type: Number,
      required: true
    },
    mainActor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Actor',
        required: true
    },
    cast: {
      type: String,
      required: true
    },
    writers: {
        type: String,
        required: true
    },
    score: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    posterImage: {
        type: Buffer,
        required: true
    },
    posterImageType: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
  })

module.exports = mongoose.model('Show', showSchema);