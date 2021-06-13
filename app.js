var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var flash = require('connect-flash')
var methodOverride = require('method-override');
var session = require('express-session');
var passportLocalmongoose = require('passport-local-mongoose')
var app = express();
var Design = require('./models/Design');
var Comment = require('./models/Comment');
var User = require('./models/User');
var keys = require('./config/keys')
// var seedDB=require('./seed')
require('./config/passport');


var commentRoutes = require('./routes/comments'),
    designRoutes = require('./routes/designs'),
    authRoutes = require('./routes/auth')

// seedDB();

mongoose.connect(keys.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
console.log()
app.set('view engine', "ejs")
// var path = require('path');
app.use(express.static(__dirname + '/public/'));
app.use(methodOverride('_method'));
app.use(flash());

app.use(session({
    secret: keys.SESSION_SECRET,
    saveUninitialized: true,
    resave: true
}))

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error')
    res.locals.success = req.flash('success')
    next();
})

app.use(authRoutes);
app.use('/building-design', designRoutes);
app.use('/building-design/:id/comments', commentRoutes);

var PORT = process.env.PORT || 8080;
app.listen(PORT, (req, res) => {
    console.log('Console Running')
});