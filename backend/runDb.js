const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('data.db', (err) => {
     if (err) {
       console.error('Error connecting to database:', err.message);
     } else {
       console.log('Connected to the database.');
     }
   });

 db.run("PRAGMA foreign_keys = ON;")

 module.exports = db