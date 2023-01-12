const express = require('express');
const router = express.Router();
const Show = require('../models/show');
const Actor = require('../models/actor');
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];


// All Shows Route
router.get('/', async (req, res)=>{
  let query = Show.find();
  if (req.query.title != null && req.query.title != '') {
    query = query.regex('title', new RegExp(req.query.title, 'i'))
  }
  if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
    query = query.lte('publishDate', req.query.publishedBefore)
  }
  if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
    query = query.gte('publishDate', req.query.publishedAfter)
  }
  try{
    const shows = await query.exec();
    res.render('shows/index', {
      shows: shows,
      searchOptions: req.query
    });

  } catch {
    res.redirect('/')
  }
  });


// New Show Route
router.get('/new', async (req, res)=>{
  renderNewPage(res, new Show());
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
    score: req.body.score,
    writers: req.body.writers
  })
  saveCover(show, req.body.cover);

  try{
    const newShow = await show.save();
    //res.redirect(`shows/${newShow.id}`);
    res.redirect('shows');
  }catch {
    renderNewPage(res, show, true);
  }
});

function saveCover(show, coverEncoded) {
  if (coverEncoded == null) return;
  const cover = JSON.parse(coverEncoded);
  if (cover != null && imageMimeTypes.includes(cover.type)) {
    show.coverImage = new Buffer.from(cover.data, 'base64');
    show.coverImageType = cover.type;
  }
}


async function renderNewPage(res, show, hasError = false) {
  try {
    const actors = await Actor.find({})
    const params = {
      actors: actors,
      show: show
    }
    if (hasError){ 
      console.log(hasError);
      params.errorMessage = 'Error Creating A SHOW!!!!'
    }
    res.render('shows/new', params)
  } catch {
    res.redirect('/shows')
  }
}
module.exports = router;