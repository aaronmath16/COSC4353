const express = require('express')
const router = express.Router()
const loggedIn = require('../passportauth').loggedIn
const loggedOut = require('../passportauth').loggedOut

var delivAddress = "614 Default Rd"
var suggPrice = null
var totPrice = null

router.get('/',loggedIn,(req,res) =>{
    res.render('quotePage.ejs', {error: '', delivAddress: delivAddress, suggPrice: suggPrice, totPrice: totPrice})
})

router.post('/',loggedIn,(req,res) =>{
    //clientside validations go here Consult the register js route for an example
    const galReq = req.body.gallonsRequested
    console.log(galReq)
    if(galReq == ''){
        res.render('quotePage.ejs', {error: "Missing Gallons Requested!", delivAddress: delivAddress, suggPrice: suggPrice, totPrice: totPrice})
    }
    res.render('quotePage.ejs', {message:"Quote Saved to History!", delivAddress: delivAddress, suggPrice: suggPrice, totPrice: totPrice})
})

module.exports = router