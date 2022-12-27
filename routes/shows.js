const express = require('express');
const router = express.Router();
const Show = require('../models/Show');
const Actor = require('../models/actor');

// All Shows Route
router.get('/', async (req, res)=>{
  res.send('new');
});


// New Show Route
router.get('/new', async (req, res)=>{
  try{
    const actors = await Actor.find({})
    const show = new Show();
    res.render('shows/new', {
      actors: actors,
      show: show
    })
  } catch {
    res.redirect('/shows');
  }
})


// Create Show Route
router.post('/', async (req, res) => {
  const show = new Show({
    title: req.body.title,
    actor: req.body.actor,
    releaseDate: new Date(req.body.releaseDate),
    averageRunTime: req.body.averageRunTime,
    description: req.body.description,
    numOfSeasons: req.body.numOfSeasons,
    averageNumOfEpisodesPerSeason: req.body.averageNumOfEpisodesPerSeason,
    cast: req.body.cast,
    score: req.body.score
  })
});

module.exports = router;