const express = require('express')
const router = express.Router()
const loggedIn = require('../passportauth').loggedIn
const loggedOut = require('../passportauth').loggedOut
router.get('/',loggedIn,(req,res) =>{
    res.render('quotePage')
})
router.post('/',loggedIn,(req,res) =>{
    //clientside validations go here Consult the register js route for an example
})
module.exports = router