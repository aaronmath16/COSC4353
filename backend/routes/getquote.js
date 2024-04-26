const FuelPricing = require('../fuelquote.js')
const express = require('express')
const sqlite3 = require('sqlite3').verbose()
const db = require( "../runDb")
const router = express.Router()
const loggedIn = require('../passportauth').loggedIn
const loggedOut = require('../passportauth').loggedOut

var delivAddress = null
const runDb = (sql,inputs) =>{
  return new Promise(function(resolve,reject){
  try{
    db.run(sql,inputs,async function(err) {
      if (err) {
        reject(console.error('Error:', err.message))
      }
      else{
        resolve("Sucess!")
      }
    })}catch(err){
      reject(err)
    }
}
  )}


const existsUid = (uid) =>{
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
        console.log(`User exists`);
        resolve(rows[0])
      }
    })}catch(err){
      reject(err)

    }
}
  )}

const existsHist = (uid) =>{
  return new Promise(function(resolve,reject){
  try{
    db.all(`SELECT * from quotes WHERE uid = ?`,[uid],async function(err,rows) {
      if (err) {
        reject(console.error('Error getting user:', err.message))
      }
      if (rows.length ==0){
        console.log(`History does not exist`);

        resolve(false)
      }else{
        console.log(`History exists`);
        resolve(true)
      }
    })}catch(err){
      reject(err)

    }
}
  )}

router.get('/',loggedIn,async (req,res) =>{
    const uid = req.user.uid
    message = null

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

    res.render('quotePage.ejs', {error:'', delivAddress: delivAddress, disableSave:true})
})

router.post('/getQuoted', loggedIn, async(req, res) =>{
  const uid = req.user.uid
  const galReq = req.body.gallonsRequested
  console.log(galReq)
  const delivDate = req.body.deliveryDate
  suggPrice = 0.00
  totPrice = 0.00
  state = ''
  histExists = false

  if(galReq == ''){
    console.log('failed gals')
      return res.redirect(302,'quotePage.ejs', {error: "Missing Gallons Requested!", delivAddress: delivAddress, suggPrice: suggPrice, totPrice: totPrice, disableSave:true})
  }
  //Potentially add an extra check here for date range
  else if(isNaN(new Date(delivDate))){
    console.log('failed date')
    return res.redirect(302,'quotePage.ejs', {error: "Invalid date!", delivAddress: delivAddress, suggPrice: suggPrice, totPrice: totPrice, disableSave:true})
  }

  row = await existsUid(uid)
  if (!row) {console.error("Error finding user profile")
      return res.render('profile.ejs',{error:"Please set your profile information before submitting a quote!"})}
  else{
    state = row.state
  }

  histExists = await existsHist(uid)
  pricing = new FuelPricing(uid, galReq, state, histExists)
  suggPrice = pricing.getPrice()
  totPrice = galReq*suggPrice
  message = "Price quoted and can be saved."

  return res.render('quotePage.ejs', {error:'', message: message, gallonsRequested: galReq, delivAddress: delivAddress, deliveryDate: delivDate, suggPrice: suggPrice, totPrice: totPrice, disableSave:false})      
})

router.post('/saveQuote',loggedIn,async(req,res) =>{
    const uid = req.user.uid
    const galReq = req.body.gallonsRequested

    const delivDate =  req.body.deliveryDate
    console.log(`DELIVERY DATE IS ${delivDate},${req.body.deliveryDate}`)
    const delivAddress = req.body.deliveryAddress

    if(galReq == ''){
      console.log('failed gals')
        return res.redirect(302,'quotePage.ejs', {error: "Missing Gallons Requested!", delivAddress: delivAddress, suggPrice: suggPrice, totPrice: totPrice, disableSave:true})
    }
    else if(isNaN(new Date(delivDate))){
      console.log('failed date')
      return res.redirect(302,'quotePage.ejs', {error: "Invalid date!", delivAddress: delivAddress, suggPrice: suggPrice, totPrice: totPrice, disableSave:true})
    }
    

      const sql = 'INSERT into quotes (uid, gallons_requested, delivery_date, address, total_price, fee) VALUES(?,?,?,?,?,?)'


      await runDb(sql,[uid, galReq, delivDate, delivAddress, totPrice, suggPrice])

      

    console.log('valid quote!')
    return res.render('quotePage.ejs', {message:"Quote will be sent to Database!", delivAddress: delivAddress, suggPrice: suggPrice, totPrice: totPrice, disableSave:true})
})

module.exports = router