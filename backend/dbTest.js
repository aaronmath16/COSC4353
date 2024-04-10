const sqlite3 = require('sqlite3').verbose();

// Connect to the SQLite database
const db = new sqlite3.Database('example.db', (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
  } else {
    console.log('Connected to the database.');
  }
});

// Create tables if not exist
db.run(`CREATE TABLE IF NOT EXISTS users (
  uid INTEGER PRIMARY KEY,
  username TEXT,
  password TEXT
)`);

db.run(`CREATE TABLE IF NOT EXISTS history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  gallonsRequested INTEGER,
  deliveryDate TEXT,
  deliveryAddress TEXT,
  suggestedPrice INTEGER,
  total INTEGER
)`);

db.run(`CREATE TABLE IF NOT EXISTS profile (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  fullName TEXT,
  address1 TEXT,
  address2 TEXT,
  city TEXT,
  state TEXT,
  zipcode INTEGER
)`);

// Insert users data into the users table
const insertUsers = () => {
  const users = require('./data').users;
  users.forEach((user) => {
    db.run('INSERT INTO users (uid, username, password) VALUES (?, ?, ?)', [user.uid, user.username, user.password], function(err) {
      if (err) {
        return console.error('Error inserting users:', err.message);
      }
      console.log(`User inserted with id: ${this.lastID}`);
    });
  });
};

// Insert history data into the history table
const insertHistory = () => {
  const history = require('./data').history;
  history.forEach((record) => {
    db.run('INSERT INTO history (name, gallonsRequested, deliveryDate, deliveryAddress, suggestedPrice, total) VALUES (?, ?, ?, ?, ?, ?)', 
    [record.name, record.gallonsRequested, record.deliveryDate, record.deliveryAddress, record.suggestedPrice, record.total], function(err) {
      if (err) {
        return console.error('Error inserting history:', err.message);
      }
      console.log(`History record inserted with id: ${this.lastID}`);
    });
  });
};

// Insert profile data into the profile table
const insertProfile = () => {
  const profile = require('./data').profile;
  profile.forEach((data) => {
    db.run('INSERT INTO profile (fullName, address1, address2, city, state, zipcode) VALUES (?, ?, ?, ?, ?, ?)', 
    [data.fullName, data.address1, data.address2, data.city, data.state, data.zipcode], function(err) {
      if (err) {
        return console.error('Error inserting profile:', err.message);
      }
      console.log(`Profile inserted with id: ${this.lastID}`);
    });
  });
};

// Call the functions to insert data
insertUsers();
insertHistory();
insertProfile();

// Close the database connection
db.close((err) => {
  if (err) {
    console.error('Error closing database:', err.message);
  } else {
    console.log('Database connection closed.');
  }
});