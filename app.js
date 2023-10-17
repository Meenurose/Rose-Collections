require('dotenv').config();
const express = require('express')

const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const Swal =  require('sweetalert2')
const session = require("express-session");
const logger = require('morgan')
const dbConnect = require('./config/dbConnection')
dbConnect(err => {
    if(err) console.log("Connection with Database failed")
})


const userRoute = require('./routes/userRoutes')
const adminRoute = require('./routes/adminRoutes')


app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
  }));

app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true}))
app.use(logger('dev'));

app.use('/', userRoute)
app.use('/admin', adminRoute)


app.listen(3000, function(){
    console.log("Server Started at port 3000...")
})
module.exports = app;