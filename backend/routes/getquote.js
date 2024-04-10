const express = require('express')
const sqlite3 = require('sqlite3').verbose()
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
    const uid = 1
    const galReq = req.body.gallonsRequested
    const delivDate = new Date(req.body.deliveryDate)
    const delivAddress = req.body.deliveryAddress
    const suggPrice = req.body.quotePrice
    const totPrice = req.body.totalDue

    if(galReq == ''){
        return res.redirect(302,'quotePage.ejs', {error: "Missing Gallons Requested!", delivAddress: delivAddress, suggPrice: suggPrice, totPrice: totPrice})
    }
    //Potentially add an extra check here for date range
    else if(isNaN(delivDate.getDate())){
        res.redirect(302,'quotePage.ejs', {error: "Invalid date!", delivAddress: delivAddress, suggPrice: suggPrice, totPrice: totPrice})
    }
    //Send to Database here!

    const db = new sqlite3.Database('data.db', (err) => {
        if (err) {
          console.error('Error connecting to database:', err.message);
        } else {
          console.log('Connected to the database.');
        }
      });

      const sql = 'INSERT into quotes (uid, gallons_requested, delivery_date, address, total_price, fee) VALUES(?,?,?,?,?,?)'

      db.run(sql, [uid, galReq, delivDate, delivAddress, totPrice, suggPrice], (err)=>{
        if (err){
            console.error('Error inserting quote: ', err.message)
        }else{
            console.log('Quote inserted.')
        }
      })

      db.close((err) => {
        if (err) {
          console.error('Error closing database:', err.message);
        } else {
          console.log('Database connection closed.');
        }
      });

    console.log('valid quote!')
    return res.render('quotePage.ejs', {message:"Quote will be sent to Database!", delivAddress: delivAddress, suggPrice: suggPrice, totPrice: totPrice})
})

module.exports = router