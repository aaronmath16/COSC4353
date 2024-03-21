const express = require('express')
const router = express.Router()
const passport = require('passport')
const loggedIn = require('../passportauth').loggedIn
const loggedOut = require('../passportauth').loggedOut

router.get('/',(req,res) =>{
    res.render('login')
})
router.post('/', passport.authenticate('local',
    {
        failureFlash:true,
        failureRedirect:'/login',
        successRedirect:'/profile'
    }))
module.exports = router