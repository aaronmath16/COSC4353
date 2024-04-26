const express = require('express')
const router = express.Router()
const loggedIn = require('../passportauth').loggedIn
const loggedOut = require('../passportauth').loggedOut
const mockdb = require('../mockdb')
const sqlite3 = require('sqlite3').verbose()



var tableHtml =''
router.get('/',loggedIn,popHistory, (req,res) =>{        
    res.render('fuelhistory.ejs', {table: tableHtml})

})

const db = require( "../runDb")



async function popHistory(req, res, next) {
const sql = "SELECT * FROM quotes WHERE uid = ?";
//wrap db calls in promises to ensure things are completed on load in.
await new Promise((resolve,reject) =>{ db.all(sql, [req.user.uid], (err, rows) => {
    if (err) reject( console.error(err.message));
    tableHtml = ''
    resolve(
    rows.forEach((row) => {
        console.log(row)
        console.log(typeof row.delivery_date)
        var date = new Date(row.delivery_date)
        var dateString = new Intl.DateTimeFormat('en-us').format(date)
        tableHtml +=  "<tr><td>" + row.gallons_requested + 
                "</td><td>" + dateString +
                "</td><td>" + row.address + 
                "</td><td> " + "$" + row.total_price + 
                "</td><td>" + "$" + row.fee + "</td></tr>";
    }))
    console.log(tableHtml)
});
})
next()
}
module.exports = router