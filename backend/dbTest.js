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
db.run(`CREATE TABLE IF NOT EXISTS user_credentials
  (uid INTEGER PRIMARY KEY,
  username CHAR(100) NOT NULL UNIQUE,
  password CHAR(100) NOT NULL
)`);

db.run(`CREATE TABLE IF NOT EXISTS client_information (
	client_id INTEGER PRIMARY KEY AUTOINCREMENT,
	uid INTEGER REFERENCES user_credentials(uid),
	name CHAR(200) NOT NULL,
	address1 CHAR(100) NOT NULL,
	address2 CHAR(100),
	city CHAR(100) NOT NULL,
	state CHAR(2) NOT NULL,
	zip INTEGER NOT NULL
)`);

db.run(`CREATE TABLE IF NOT EXISTS quotes
  (quote_id INTEGER PRIMARY KEY AUTOINCREMENT,
  uid INTEGER REFERENCES user_credentials(uid),
  delivery_date DATE NOT NULL,
  address CHAR(100) NOT NULL,
  city CHAR(100) NOT NULL,
  state CHAR(2) NOT NULL,
  zip INTEGER NOT NULL,
  total_price NUMERIC NOT NULL,
  fee NUMERIC NOT NULL
)`);

db.run(`CREATE TABLE IF NOT EXISTS states
  (state CHAR(25) PRIMARY KEY,
  abbr CHAR(2) UNIQUE NOT NULL
)`);

// Insert users data into the users table
const insertUsers = () => {
  const users = require('./data').users;
  users.forEach((user) => {
    db.run('INSERT INTO user_credentials (uid, username, password) VALUES (?, ?, ?)', [user.uid, user.username, user.password], function(err) {
      if (err) {
        return console.error('Error inserting users:', err.message);
      }
      console.log(`User inserted with id: ${this.lastID}`);
    });
  });
};

// Insert history data into the history table
const insertQuote = () => {
  const history = require('./data').history;
  history.forEach((record) => {
    db.run('INSERT INTO quotes (name, gallonsRequested, deliveryDate, deliveryAddress, suggestedPrice, total) VALUES (?, ?, ?, ?, ?, ?)', 
    [record.name, record.gallonsRequested, record.deliveryDate, record.deliveryAddress, record.suggestedPrice, record.total], function(err) {
      if (err) {
        return console.error('Error inserting history:', err.message);
      }
      console.log(`History record inserted with id: ${this.lastID}`);
    });
  });
};

// Insert profile data into the profile table
const insertClientInfo = () => {
  const profile = require('./data').profile;
  profile.forEach((data) => {
    db.run('INSERT INTO client_information (fullName, address1, address2, city, state, zipcode) VALUES (?, ?, ?, ?, ?, ?)', 
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
insertQuote();
insertProfile();

// Close the database connection
db.close((err) => {
  if (err) {
    console.error('Error closing database:', err.message);
  } else {
    console.log('Database connection closed.');
  }
});