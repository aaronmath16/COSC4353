const express = require('express')
const router = express.Router()
const loggedIn = require('../passportauth').loggedIn
const loggedOut = require('../passportauth').loggedOut
router.get('/',loggedIn,(req,res) =>{
    res.render('fuelhistory')
})

//This one might be a bit tricky especially without the DB put in yet.  Maybe a mock DB can be put in here alone and then use EJS to dynamically fill the tables with that info.

module.exports = router