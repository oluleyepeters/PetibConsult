var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var flash = require('connect-flash')
var methodOverride = require('method-override');
var session = require('express-session');
var passportLocalmongoose = require('passport-local-mongoose')
var app = express();
var keys = require('./config/keys')
// var seedDB=require('./seed')
require('./config/passport');


var commentRoutes = require('./routes/comments'),
    designRoutes = require('./routes/designs'),
    authRoutes = require('./routes/auth')

const mongoose = require('mongoose')
mongoose.promise = global.Promise;

const connectionParams = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}

mongoose.connect(keys.mongoURI, connectionParams)
    .then(() => {
        console.log('Connected to database ')
    })
    .catch((err) => {
        console.error(`Error connecting to the database. \n${err}`);
    })

app.set('view engine', "ejs")
var path = require('path');

app.use(express.urlencoded({ extended: true }))
app.use(express.json());

app.use(express.static(__dirname + '/public/'));
app.use(methodOverride('_method'));

app.use(flash());

app.use(session({
    Mage: 24 * 60 * 60 * 1000,
    secret: keys.mongoURI,
    resave: false,
    saveUninitialized: false
}));

// app.use(session({
//     name: 'session',
//     keys: [keys.cookieKey],
//     maxAge: 48 * 60 * 60 * 1000 // 24 hours
// }))

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