const express = require('express');
const router = express.Router();
const Actor = require('../models/actor');

// All Actors Route
router.get('/', (req, res)=>{
  res.render('actors/index');
});

// New Actor Route
router.get('/new', (req, res)=>{
  res.render('actors/new', { actor: new Actor() });
});


// Create Actor Route
router.post('/', async (req, res) => {
  const actor = new Actor({
    name: req.body.name
  });
  try {
    const newActor = await actor.save();
    // res.redirect(`actors/${newActor.id}`);
    res.redirect(`actors`)
  } catch {
    res.render('actors/new', {
      actor: actor,
      errorMessage: 'Error creating Actor'
    });
  }
});

module.exports = router;