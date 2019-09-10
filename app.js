var express = require('express');
var bodyParser= require('body-parser');
var mongoose=require('mongoose');
var passport=require('passport');
var LocalStrategy=require('passport-local');
var flash= require('connect-flash')
var methodOverride=require('method-override');
var cookieSession=require('cookie-session');
var passportLocalmongoose=require('passport-local-mongoose')
var app=express();
var Design = require('./models/Design');
var Comment = require('./models/Comment');
var User = require('./models/User');
var keys=require('./config/keys')
// var seedDB=require('./seed')
require('./config/passport');


var commentRoutes= require('./routes/comments'),
    designRoutes= require('./routes/designs'),
    authRoutes= require('./routes/auth')
// we are calling in the function that will delete the whole function
// seedDB();

mongoose.connect(keys.mongoURI);
console.log()
// mongoose.connect("mongodb://oluleyepeters:may00m1kun@ds237373.mlab.com:37373/petibconsult")
app.set('view engine', "ejs")
// var path = require('path');
app.use(bodyParser.json());
app.use(express.static(__dirname+'/public/'));
app.use(bodyParser.urlencoded({extended:true}))
app.use(methodOverride('_method'));
app.use(flash());

// Configuring our passport
// app.use(require('express-session')({
//     Mage:24 * 60 * 60 * 1000,
//     secret:'wedded',
//     resave:false,
//     saveUninitialized:false
// }));

app.use(cookieSession({
    name: 'session',
    keys: [keys.cookieKey],
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }))

app.use(passport.initialize());
app.use(passport.session());


app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    res.locals.error=req.flash('error')
    res.locals.success=req.flash('success')
    next();
})

app.use(authRoutes);
app.use('/building-design',designRoutes);
app.use('/building-design/:id/comments',commentRoutes);


var PORT= process.env.PORT || 8080;
app.listen(PORT, (req,res) => {
	console.log('Console Running')
});