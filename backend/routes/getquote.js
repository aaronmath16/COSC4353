const express = require('express')
const router = express.Router()
const loggedIn = require('../passportauth').loggedIn
const loggedOut = require('../passportauth').loggedOut

var delivAddress = "614 Default Rd"
var suggPrice = null
var totPrice = null

router.get('/',loggedIn,(req,res) =>{
    res.render('quotePage.ejs', {error:'',delivAddress: delivAddress, suggPrice: suggPrice, totPrice: totPrice})
})

router.post('/',loggedIn,(req,res) =>{
    //clientside validations go here Consult the register js route for an example
    const galReq = req.body.gallonsRequested
    const delivDate = new Date(req.body.deliveryDate)
    console.log(req.body.deliveryDate)
    console.log(galReq)
    if(galReq == ''){
        return res.redirect(302,'quotePage.ejs', {error: "Missing Gallons Requested!", delivAddress: delivAddress, suggPrice: suggPrice, totPrice: totPrice})
    }
    //Potentially add an extra check here for date range
    else if(isNaN(delivDate.getDate())){
        res.redirect(302,'quotePage.ejs', {error: "Invalid date!", delivAddress: delivAddress, suggPrice: suggPrice, totPrice: totPrice})
    }
    //Send to Database here!
    console.log('valid quote!')
    return res.render('quotePage.ejs', {message:"Quote will be send to Database!", delivAddress: delivAddress, suggPrice: suggPrice, totPrice: totPrice})
})

module.exports = router