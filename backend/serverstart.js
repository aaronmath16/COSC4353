const db = require( "./runDb")

const app = require('./server')
try{
    const db = require( "./runDb")
    app.listen(3000)
    console.log("Server started at port 3000")
}catch(e){
    console.error(e)
}

//find way to close db gracefull
/* db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('Database connection closed.');
    } 
  }) */