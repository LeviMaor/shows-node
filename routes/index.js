const express = require('express')
const router = express.Router()
const Tvshow = require('../models/tvshow')

router.get('/', async (req, res) => {
  let tvshows
  try {
    tvshows = await Tvshow.find().sort({ createdAt: 'desc' }).limit(10).exec()
  } catch {
    tvshows = []
  }
  res.render('index', { tvshows: tvshows })
})

module.exports = router