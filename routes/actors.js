const express = require('express');
const router = express.Router();
const Actor = require('../models/actor');

// All Actors Route
router.get('/', async (req, res)=>{
  let searchOptions = {};
  if(req.query.name != null && req.query.name !== '') {
    searchOptions.name = new RegExp(req.query.name, 'i');
  }
  try{
    const actors = await Actor.find(searchOptions); 
    res.render('actors/index', {
      actors: actors,
      searchOptions: req.query
    });
  } catch {
    res.redirect('/');
  }  
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