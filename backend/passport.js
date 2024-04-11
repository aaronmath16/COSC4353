const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const mockdb = require('./mockdb')
const mockusers = mockdb.users
console.log(mockusers)
const sqlite3 = require('sqlite3').verbose();

//this doesnt work, db needs to be shared across, not a new instance each time. fix later
// const db = new sqlite3.Database('data.db', (err) => {
//     if (err) {
//       console.error('Error connecting to database:', err.message);
//     } else {
//       console.log('Connected to the database.');
//     }
//   });

// db.run("PRAGMA foreign_keys = ON;")

const db = require( "./runDb")

const existsUser = (username) =>{
    //check if the user exists
    //wrapped in a promise + try catch block because sqlite doesnt seem to support async properly
    return new Promise(function(resolve,reject){
    try{
      db.all(`SELECT * FROM user_credentials WHERE username = $1`,[username],async function(err,rows) {
        if (err) {
          reject(console.error('Error getting user:', err.message))
        }
        if (rows.length ==0){
          console.log(`User does not exist`);

          resolve(false)
        }else{
          //console.log(rows[0])
          console.log(`User exists`);
          resolve(rows[0])
          
        }
      })}catch(err){
        reject(err)

      }
}
    )}

const existsId = (uid) =>{
  //same function as existsUser but for uids, for deserializing
  return new Promise(function(resolve,reject){
    try{
      db.all(`SELECT * FROM user_credentials WHERE uid = $1`,[uid],async function(err,rows) {
        if (err) {
          reject( console.error('Error getting id:', err.message))
        }
        if (rows.length ==0 ){
          resolve(false)
        }else{
          console.log(`id exists`);
          resolve(rows[0])
        }
      })}catch(err){
        reject(err)

      }
}
    )}

passport.use(new LocalStrategy(
    async (username,password,done) => {
        let user = await existsUser(username)
        console.log(user)
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
passport.deserializeUser(async (uid,done) =>{
    //const user = mockusers.find(x => x.uid === uid)
    //const result = pool.query(`SELECT * FROM user_credentials WHERE uid = $1`,[uid])
    console.log(uid)
    const user = await existsId(uid)
    if(!user){
      return false
    }else{
          console.log(`id exists`)
          return done(null,user)
        }

    //return done(null,rows[0])
    //done(null,user)
})