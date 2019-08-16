/* Express stuff*/
const express = require('express');
const session = require('express-session');
const app = express();
/* MongoDB stuff*/
const mongo = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const morgan = require('morgan'); // Logging reqs
/* Passport stuff */
const passport = require('passport');
const flash = require('connect-flash');

require('dotenv').config();
var cors = (function(req,res,next){
    if (req.method === "OPTIONS") {
        res.header('Access-Control-Allow-Origin', req.headers.origin);
      } else {
        res.header('Access-Control-Allow-Origin', '*');
      }
    next();
});

app.use(cors);

mongoose.connect(process.env.MONGOURL, {useNewUrlParser:true}).then(res=>console.log('Connected to Mongo Database')).catch(err=>console.log(`error: ${err}`))
mongoose.set('useCreateIndex',true)
require('./config/passport')(passport);
app.use(morgan('dev'))
app.use(express.static('public'));
app.use(flash());

app.use(session({secret:process.env.SESSION_SECRET,resave:true,saveUninitialized:true}))
require('./app/routes.js')(app,passport);

app.engine('html', require('ejs').renderFile);
app.set('views', 'views');
app.set('view engine', 'html');

app.listen(process.env.SERVER_PORT,function(){
    console.log(`Server started, listening for requests on port ${process.env.SERVER_PORT}`)
})
