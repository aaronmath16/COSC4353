const express = require('express')
const router = express.Router()
const loggedIn = require('../passportauth').loggedIn
const loggedOut = require('../passportauth').loggedOut
const mockdb = require('../mockdb')
//const mockhistory = mockdb.history
const sqlite3 = require('sqlite3').verbose()

/*var tableEntries = mockhistory
var tableHtml =''

router.get('/',loggedIn,popHistory, (req,res) =>{        
    res.render('fuelhistory.ejs', {table: tableHtml})

})*/

const db = require( "../runDb")

/*const db = new sqlite3.Database('data.db', (err) => {
    if (err) {
      console.error('Error connecting to database:', err.message);
    } else {
      console.log('Connected to the database.');
    }
  });*/

var tableHtml =''
const sql = "SELECT * FROM quotes";
db.all(sql, [], (err, rows) => {
    if (err) return console.error(err.message);

    rows.forEach((row) => {
        tableHtml +=  "</td><td>" + row.gallons_requested + 
                "</td><td>" + row.delivery_date + 
                "</td><td>" + row.address + 
                "</td><td> " + "$" + row.total_price + 
                "</td><td>" + "$" + row.fee + "</td></tr>";
    });
});


/*function popHistory(req, res, next) {
    // Clear existing table rows
    tableHtml = ''

    // Populate table with fetched data
    try{
        tableEntries.forEach(entry =>{
                tableHtml +=  "</td><td>" + entry.gallons_requested  + 
                "</td><td>" + entry.delivery_date + 
                "</td><td>" + entry.address + 
                "</td><td> " + "$" + entry.total_price  + 
                "</td><td>" + "$" + entry.fee + "</td></tr>";
        })
    }catch(error) {
        console.error('Error fetching fuel history:', error);
        res.redirect('quotePage.ejs',{error: "Error Fetching fuel history."})
    }
    next()
}*/


/*db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('Database connection closed.');
    }
    });
    */


module.exports = router