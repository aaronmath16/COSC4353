const express = require('express')
const router = express.Router()
const loggedIn = require('../passportauth').loggedIn
const loggedOut = require('../passportauth').loggedOut

var delivAddress = "614 Default Rd"
var suggPrice = null
var totPrice = null

router.get('/',loggedIn,(req,res) =>{
    res.render('quotePage.ejs', {delivAddress: delivAddress, suggPrice: suggPrice, totPrice: totPrice})
})
router.post('/',loggedIn,(req,res) =>{
    //clientside validations go here Consult the register js route for an example
})

function calcPrice(req, res, next){
    //Todo calculate suggested price and total price
    next()
}

module.exports = router