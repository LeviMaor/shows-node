const mongoose = require('mongoose')
const Tvshow = require('./tvshow')

const actorSchema = new mongoose.Schema({
  name: {
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
  description: {
    type: String
  }
})

actorSchema.virtual('coverImagePath').get(function() {
  if (this.coverImage != null && this.coverImageType != null) {
    return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
  }
})

actorSchema.pre('remove', function(next) {
  Tvshow.find({ actor: this.id }, (err, tvshows) => {
    if (err) {
      next(err)
    } else if (tvshows.length > 0) {
      next(new Error('This actor has Tv shows still'))
    } else {
      next()
    }
  })
})

module.exports = mongoose.model('Actor', actorSchema)