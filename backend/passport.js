const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const mockdb = require('./mockdb')
const mockusers = mockdb.users
console.log(mockusers)
const sqlite3 = require('sqlite3').verbose();

//this doesnt work, db needs to be shared across, not a new instance each time. fix later
const db = new sqlite3.Database('data.db', (err) => {
    if (err) {
      console.error('Error connecting to database:', err.message);
    } else {
      console.log('Connected to the database.');
    }
  });

db.run("PRAGMA foreign_keys = ON;")

const existsUser = (username) =>{
    //check if the user exists
    
    const result = db.run(`SELECT * FROM user_credentials WHERE username = $1`,[username],function(err) {
        if (err) {
          return console.error('Error getting user:', err.message);
        }
        console.log(`User exists`);
      })
    if (result.rowCount ==0){
        return false
    }
    return result.rows[0]
}



passport.use(new LocalStrategy(
    async (username,password,done) =>{
        const user = existsUser(username)
        //const user = mockusers.find(n => n.username === username);
        if(!user){
            return done(null,false,{message:'User not found'})
        }
        if (await bcrypt.compare(password,user.password)){
            return done(null,user)
        }else{
            console.log(await bcrypt.compare(password,user.password))
            //console.log(await bcrypt.hash('testing',10))

            return done(null,false,{message:"Wrong Password"})
        }
    }
))

passport.serializeUser((user,done) =>{
    done(null,user.uid);
})
passport.deserializeUser((uid,done) =>{
    //const user = mockusers.find(x => x.uid === uid)
    //const result = pool.query(`SELECT * FROM user_credentials WHERE uid = $1`,[uid])
    const result = db.run(`SELECT * FROM user_credentials WHERE uid = $1`,[uid],function(err) {
        if (err) {
          return console.error('Error getting id:', err.message);
        }
        console.log(`id exists`);
      })
    return done(null,result.rows[0])
    //done(null,user)
})