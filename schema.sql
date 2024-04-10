--credentials for login, will be hashed
CREATE TABLE IF NOT EXISTS user_credentials
	(uid INTEGER PRIMARY KEY,
	username CHAR(100) NOT NULL UNIQUE,
	password CHAR(100) NOT NULL);

--client info, key reference to credentials
CREATE TABLE IF NOT EXISTS client_information (
	client_id INTEGER PRIMARY KEY AUTOINCREMENT,
	uid INTEGER REFERENCES user_credentials(uid),
	name CHAR(200) NOT NULL,
	address1 CHAR(100) NOT NULL,
	address2 CHAR(100),
	city CHAR(100) NOT NULL,
	state CHAR(2) NOT NULL,
	zip INTEGER NOT NULL);

--quote info, references to credentials.  stores each quote
CREATE TABLE IF NOT EXISTS quotes
	(quote_id INTEGER PRIMARY KEY AUTOINCREMENT,
	uid INTEGER REFERENCES user_credentials(uid),
	delivery_date DATE NOT NULL,
	address CHAR(100) NOT NULL,
	city CHAR(100) NOT NULL,
	state CHAR(2) NOT NULL,
	zip INTEGER NOT NULL,
	total_price NUMERIC NOT NULL,
	fee NUMERIC NOT NULL);
--table for states as recommended
CREATE TABLE IF NOT EXISTS states
	(state CHAR(25) PRIMARY KEY,
		abbr CHAR(2) UNIQUE NOT NULL);
	
