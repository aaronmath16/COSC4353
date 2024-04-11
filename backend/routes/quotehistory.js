const express = require('express')
const router = express.Router()
const loggedIn = require('../passportauth').loggedIn
const loggedOut = require('../passportauth').loggedOut
const mockdb = require('../mockdb')
//const mockhistory = mockdb.history
const sqlite3 = require('sqlite3').verbose()

/*var tableEntries = mockhistory
var tableHtml =''
*/

var tableHtml =''
router.get('/',loggedIn,popHistory, (req,res) =>{        
    res.render('fuelhistory.ejs', {table: tableHtml})

})

const db = require( "../runDb")



async function popHistory(req, res, next) {
const sql = "SELECT * FROM quotes";
await db.all(sql, [], (err, rows) => {
    if (err) return console.error(err.message);
    tableHtml = ''
    rows.forEach((row) => {
        console.log(row)
        console.log(typeof row.delivery_date)
        var date = new Date(parseInt(row.delivery_date))
        var dateString = new Intl.DateTimeFormat('en-us').format(date)
        tableHtml +=  "<tr><td>" + row.gallons_requested + 
                "</td><td>" + dateString +
                "</td><td>" + row.address + 
                "</td><td> " + "$" + row.total_price + 
                "</td><td>" + "$" + row.fee + "</td></tr>";
    });
    console.log(tableHtml)
});
next()
}


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