const app = require('./server')
try{
    app.listen(3000)
    console.log("Server started at port 3000")
}catch(e){
    console.error(e)
}