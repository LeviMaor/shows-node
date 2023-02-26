const express = require('express')
const router = express.Router()
const Actor = require('../models/actor')
const Tvshow = require('../models/tvshow')
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']

// All Actors Route
router.get('/', async (req, res) => {
  let searchOptions = {}
  if (req.query.name != null && req.query.name !== '') {
    searchOptions.name = new RegExp(req.query.name, 'i')
  }
  try {
    const actors = await Actor.find(searchOptions)
    res.render('actors/index', {
      actors: actors,
      searchOptions: req.query
    })
  } catch {
    res.redirect('/')
  }
})

// New Actor Route
router.get('/new', (req, res) => {
  res.render('actors/new', { actor: new Actor() })
})

// Create Actor Route
router.post('/', async (req, res) => {
  const actor = new Actor({
    name: req.body.name,
    description: req.body.description
  })

  try {
    saveCover(actor, req.body.cover)
    const newActor = await actor.save()
    res.redirect(`actors/${newActor.id}`)
  } catch {
    res.render('actors/new', {
      actor: actor,
      errorMessage: 'Error creating Actor'
    })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const actor = await Actor.findById(req.params.id)
    const tvshows = await Tvshow.find({ actor: actor.id }).limit(6).exec()
    res.render('actors/show', {
      actor: actor,
      tvshowsByActor: tvshows
    })
  } catch {
    res.redirect('/')
  }
})

router.get('/:id/edit', async (req, res) => {
  try {
    const actor = await Actor.findById(req.params.id)
    res.render('actors/edit', { actor: actor })
  } catch {
    res.redirect('/actors')
  }
})

router.put('/:id', async (req, res) => {
  let actor
  try {
    actor = await Actor.findById(req.params.id)
    actor.name = req.body.name
    actor.description = req.body.description
    if (req.body.cover != null && req.body.cover !== '') {
      saveCover(actor, req.body.cover)
    }
    await actor.save()
    res.redirect(`/actors/${actor.id}`)
  } catch {
    if (actor == null) {
      res.redirect('/')
    } else {
      res.render('actors/edit', {
        actor: actor,
        errorMessage: 'Error updating Actor'
      })
    }
  }
})

router.delete('/:id', async (req, res) => {
  let actor
  try {
    actor = await Actor.findById(req.params.id)
    await actor.remove()
    res.redirect('/actors')
  } catch {
    if (actor == null) {
      res.redirect('/')
    } else {
      res.redirect(`/actors/${actor.id}`)
    }
  }
})

function saveCover(actor, coverEncoded) {
  if (coverEncoded == null) return
  const cover = JSON.parse(coverEncoded)
  if (cover != null && imageMimeTypes.includes(cover.type)) {
    actor.coverImage = new Buffer.from(cover.data, 'base64')
    actor.coverImageType = cover.type
  }
}


module.exports = router