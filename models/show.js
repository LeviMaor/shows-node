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
    coverImage: {
        type: Buffer,
        required: true
    },
    coverImageType: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
  })

  showSchema.virtual('coverImagePath').get(function(){
    if (this.coverImage != null && this.coverImageType != null) {
        return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
      }
  })

module.exports = mongoose.model('Show', showSchema);
