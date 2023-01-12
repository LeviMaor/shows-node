const express = require('express')
const router = express.Router()
const Tvshow = require('../models/tvshow')
const Actor = require('../models/actor')
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']

// All Tv shows Route
router.get('/', async (req, res) => {
  let query = Tvshow.find()
  if (req.query.title != null && req.query.title != '') {
    query = query.regex('title', new RegExp(req.query.title, 'i'))
  }
  if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
    query = query.lte('publishDate', req.query.publishedBefore)
  }
  if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
    query = query.gte('publishDate', req.query.publishedAfter)
  }
  if (req.query.genre != null && req.query.genre != "") {
    query = query.regex("genre", new RegExp(req.query.genre, "i"));
  }
  try {
    const tvshows = await query.exec()
    res.render('tvshows/index', {
      tvshows: tvshows,
      searchOptions: req.query
    })
  } catch {
    res.redirect('/')
  }
})

// New Tv show Route
router.get('/new', async (req, res) => {
  renderNewPage(res, new Tvshow())
})

// Create Tv show Route
router.post('/', async (req, res) => {
  const tvshow = new Tvshow({
    title: req.body.title,
    actor: req.body.actor,
    publishDate: new Date(req.body.publishDate),
    duration: req.body.duration,
    description: req.body.description,
    writers: req.body.writers,
    supportingActors: req.body.supportingActors,
    genre: req.body.genre
  })
  saveCover(tvshow, req.body.cover)

  try {
    const genreString = req.body.genre.toString()
    tvshow.genre = genreString
    const newTvshow = await tvshow.save()
    res.redirect(`tvshows/${newTvshow.id}`)
  } catch {
    renderNewPage(res, tvshow, true)
  }
})

// Show Tv show Route
router.get('/:id', async (req, res) => {
  try {
    const tvshow = await Tvshow.findById(req.params.id)
                           .populate('actor')
                           .exec()
    res.render('tvshows/show', { tvshow: tvshow })
  } catch {
    res.redirect('/')
  }
})

// Edit Tv show Route
router.get('/:id/edit', async (req, res) => {
  try {
    const tvshow = await Tvshow.findById(req.params.id)
    renderEditPage(res, tvshow)
  } catch {
    res.redirect('/')
  }
})

// Update Tv show Route
router.put('/:id', async (req, res) => {
  let tvshow

  try {
    tvshow = await Tvshow.findById(req.params.id)
    tvshow.title = req.body.title
    tvshow.actor = req.body.actor
    tvshow.publishDate = new Date(req.body.publishDate)
    tvshow.duration = req.body.duration
    tvshow.description = req.body.description
    tvshow.writers = req.body.writers
    tvshow.supportingActors = req.body.supportingActors
    tvshow.genre = req.body.genre
    if (req.body.cover != null && req.body.cover !== '') {
      saveCover(tvshow, req.body.cover)
    }
    await tvshow.save()
    res.redirect(`/tvshows/${tvshow.id}`)
  } catch {
    if (tvshow != null) {
      renderEditPage(res, tvshow, true)
    } else {
      redirect('/')
    }
  }
})

// Delete Tv show Page
router.delete('/:id', async (req, res) => {
  let tvshow
  try {
    tvshow = await Tvshow.findById(req.params.id)
    await tvshow.remove()
    res.redirect('/tvshows')
  } catch {
    if (tvshow != null) {
      res.render('tvshows/show', {
        tvshow: tvshow,
        errorMessage: 'Could not remove tv show'
      })
    } else {
      res.redirect('/')
    }
  }
})

async function renderNewPage(res, tvshow, hasError = false) {
  renderFormPage(res, tvshow, 'new', hasError)
}

async function renderEditPage(res, tvshow, hasError = false) {
  renderFormPage(res, tvshow, 'edit', hasError)
}

async function renderFormPage(res, tvshow, form, hasError = false) {
  try {
    const actors = await Actor.find({})
    const params = {
      actors: actors,
      tvshow: tvshow
    }
    if (hasError) {
      if (form === 'edit') {
        params.errorMessage = 'Error Updating Tv show'
      } else {
        params.errorMessage = 'Error Creating Tv show'
      }
    }
    res.render(`tvshows/${form}`, params)
  } catch {
    res.redirect('/tvshows')
  }
}

function saveCover(tvshow, coverEncoded) {
  if (coverEncoded == null) return
  const cover = JSON.parse(coverEncoded)
  if (cover != null && imageMimeTypes.includes(cover.type)) {
    tvshow.coverImage = new Buffer.from(cover.data, 'base64')
    tvshow.coverImageType = cover.type
  }
}

module.exports = router