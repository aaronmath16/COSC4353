const express = require('express')
const db = require( "../runDb")
const router = express.Router()
const loggedIn = require('../passportauth').loggedIn
const loggedOut = require('../passportauth').loggedOut
const states = [ 'AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FM', 'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MH', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'MP', 'OH', 'OK', 'OR', 'PW', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY' ];
const mockdb = require('../mockdb')
const mockProfile = mockdb.profile
const sqlite3 = require('sqlite3').verbose()


var delivAddress = null

var mockprofile = mockProfile[0]
var name = null
var address = null
var address2 = null
var city = null
var state = null
var zipcode = null
router.get('/',loggedIn, Info, (req,res) =>{
    res.render('profile', {error: '', fullname: name, address1:address, address2: address2, city: city, state: state, zipcode: zipcode})
})

router.post('/',loggedIn,(req,res) =>{
    const uid = req.user.uid
    const {fullname , address1 , address2, city, state , zipcode} = req.body
    if (fullname == '' || address1 == '' || city == '' || state == '' || zipcode == ''){
        return res.render('profile.ejs',{error:'Missing input!', fullname: fullname, address1: address1, address2:address2, city: city, state: state, zipcode: zipcode})
    }


    if (fullname.length > 50){
        error = "Name too long"
        return res.render('profile.ejs',{error:error, address1: address1, address2:address2, city: city, state: state, zipcode: zipcode})
    }
    if (address1.length > 100){
        error = "Address 1 too long"
        return res.render('profile.ejs',{error:error, fullname: fullname, address2:address2, city: city, state: state, zipcode: zipcode})
    }
    if (address2.length > 100){
        error = "Address 2 too long"
        return res.render('profile.ejs',{error:error, fullname: fullname, address1: address1, city: city, state: state, zipcode: zipcode})
    }
    if (city.length > 100){
        error = "City too long"
        return res.render('profile.ejs',{error:error, fullname: fullname, address1: address1, address2:address2, state: state, zipcode: zipcode})
    }
    if(!states.includes(state)){
        error = "Invalid State code"
        return res.render('profile.ejs',{error:error, fullname: fullname, address1: address1, address2:address2, city: city, zipcode: zipcode})
    }
    if(zipcode.length < 5 || zipcode.length > 9){
        error = "Invalid zip code"
        return res.render('profile.ejs',{error:error, fullname: fullname, address1: address1, address2:address2, city: city, state: state})
    }

    delivAddress = address1 + ' ' + address2 + ' ' + city + ' ' + state + ' ' + zipcode

    /*const db = new sqlite3.Database('data.db', (err) => {
        if (err) {
            console.error('Error connecting to database:', err.message);
        }
        else{
            console.log('Connected to the database.');
        }
    });*/


    //TODO UID/client_id (schema redesign?) and also only run one of these, maybe a try block or a simple check for existing values
    const Insertsql = 'INSERT into client_information (uid, name, address1, address2, city, state, zip) VALUES(?, ?,?,?,?,?,?)'
    const Updatesql = 'UPDATE client_information SET name = ?, address1 = ?, address2 = ?, city = ?, state = ?, zip = ? WHERE uid = ?';

    db.run(Insertsql, [uid, fullname, address1, address2, city, state, zipcode], (err) => {
        if (err){
            console.error('Error inserting info: ', err.message)
        }
        else{
            console.log('Info inserted')
        }
    })

    db.run(Updatesql, [fullname, address1, address2, city, state, zipcode, req.user.uid], (err) => {
        if (err){
            console.error('Error updating info: ', err.message)
        }
        else{
            console.log('Info updated')
        }
    })

    /*db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        }
        else{
            console.log('Database connection closed.');
        }
    });*/


    var suggPrice = 1.50
    var totPrice = 0

    return res.render('quotePage.ejs', {delivAddress: delivAddress, suggPrice: suggPrice, totPrice: totPrice})
})

function Info(req, res, next) {
    name = mockprofile.fullName
    address = mockprofile.address1
    address2 = mockprofile.address2
    city = mockprofile.city
    state = mockprofile.state
    zipcode = mockprofile.zipcode
    next()
}

module.exports = router