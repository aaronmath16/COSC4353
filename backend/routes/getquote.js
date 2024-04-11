const express = require('express')
const sqlite3 = require('sqlite3').verbose()
const db = require( "../runDb")
const router = express.Router()
const loggedIn = require('../passportauth').loggedIn
const loggedOut = require('../passportauth').loggedOut

var delivAddress = null


const existsUid = (uid) =>{
  //check if the user exists
  //wrapped in a promise + try catch block because sqlite doesnt seem to support async properly
  return new Promise(function(resolve,reject){
  try{
    db.all(`SELECT address1, address2, city, state, zip from client_information WHERE uid = ?`,[uid],async function(err,rows) {
      if (err) {
        reject(console.error('Error getting user:', err.message))
      }
      if (rows.length ==0){
        console.log(`User does not exist`);

        resolve(false)
      }else{
        //console.log(rows[0])
        console.log(`User exists`);
        resolve(rows[0])
      }
    })}catch(err){
      reject(err)

    }
}
  )}


router.get('/',loggedIn,async (req,res) =>{
    const uid = req.user.uid
    var suggPrice = 1.50
    var totPrice = 0.0

    const sql = 'SELECT address1, address2, city, state, zip from client_information WHERE uid = ?'
    row = await existsUid(uid)
      if (!row) {console.error("Error finding user profile")
                return res.render('profile.ejs',{error:"Please set your profile information before submitting a quote!"})}
      else{
        console.log(row)
   
      delivAddress = row.address1 + ' '
      delivAddress += row.address2 + ' '
      delivAddress += row.city + ' '
      delivAddress += row.state + ' '
      delivAddress += row.zip
      }

    res.render('quotePage.ejs', {error:'',delivAddress: delivAddress, suggPrice: suggPrice, totPrice: totPrice})
})

router.post('/',loggedIn,(req,res) =>{
    //clientside validations go here Consult the register js route for an example
    const uid = req.user.uid
    const galReq = req.body.gallonsRequested
    const delivDate = new Date(req.body.deliveryDate)
    const delivAddress = req.body.deliveryAddress
    const suggPrice = 1.50

    if(galReq == ''){
      console.log('failed gals')
        return res.redirect(302,'quotePage.ejs', {error: "Missing Gallons Requested!", delivAddress: delivAddress, suggPrice: suggPrice, totPrice: totPrice})
    }
    //Potentially add an extra check here for date range
    else if(isNaN(delivDate.getDate())){
      console.log('failed date')

        res.redirect(302,'quotePage.ejs', {error: "Invalid date!", delivAddress: delivAddress, suggPrice: suggPrice, totPrice: totPrice})
    }
    //Send to Database here!

    const totPrice = galReq * suggPrice

    /*const db = new sqlite3.Database('data.db', (err) => {
        if (err) {
          console.error('Error connecting to database:', err.message);
        } else {
          console.log('Connected to the database.');
        }
      });*/

      const sql = 'INSERT into quotes (uid, gallons_requested, delivery_date, address, total_price, fee) VALUES(?,?,?,?,?,?)'

      db.run(sql, [uid, galReq, delivDate, delivAddress, totPrice, suggPrice], (err)=>{
        if (err){
            console.error('Error inserting quote: ', err.message)
        }else{
            console.log('Quote inserted.')
        }
      })

      /*db.close((err) => {
        if (err) {
          console.error('Error closing database:', err.message);
        } else {
          console.log('Database connection closed.');
        }
      });*/

    console.log('valid quote!')
    return res.render('quotePage.ejs', {message:"Quote will be sent to Database!", delivAddress: delivAddress, suggPrice: suggPrice, totPrice: totPrice})
})

module.exports = router