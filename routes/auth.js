var express = require('express')
var router = express.Router();
var passport = require('passport');
var User = require('../models/User');
var Mail = require('../models/Auth');
var crypto = require('crypto');
const keys = require('../config/keys');
// var Mailer=require('../config/Mailer');
// var configTemplate=require('../config/emailTemplates/configTemplate')
// var config2Template=require('../config/emailTemplates/config2Template')

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(keys.sendGrid)


router.get('/', function (req, res) {
    res.render('HomePage')
});

router.get('/aboutUs', function (req, res) {
    res.render('AboutUs')
});

router.get('/register', function (req, res) {
    res.render('register')
})

function hashPassword(str) {
    hashingSecret = "fuckoff"
    var hash = crypto.createHmac('sha256', hashingSecret).update(str).digest('hex');
    return hash
}

function createRandomString(strLength) {
    // Define all the possible characters that could go into a string
    var possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    // Start the final string
    var str = '';
    for (i = 1; i <= strLength; i++) {
        // Get a random charactert from the possibleCharacters string
        var randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
        // Append this character to the string
        str += randomCharacter;
    }
    // Return the final string
    return str;
}

router.get('/verify/:token', async (req, res) => {
    const user = await User.findOne({ 'token': req.params.token });
    if (!user) {
        req.flash('error', 'no user found')
        res.redirect('/')
    } else {
        user.active = true;
        user.token = '';
        await user.save();
        res.render('activated')
    }
});

router.post('/register', async (req, res) => {
    var email = req.body.email
    var username = req.body.username
    var password = req.body.password
    console.log(email)
    const user = await User.findOne({ "email": req.body.email })
    if (user) {
        req.flash('error', 'Email is already in use.');
        res.redirect('/register')
    } else {
        var hashedpassword = hashPassword(password)
        var token = createRandomString(20);
        User.create({
            email: email,
            username: username,
            password: hashedpassword,
            token: token
        }, function (err, user) {
            if (err) {
                console.log(err);
            } else {
                const msg = {
                    to: email,
                    from: 'oluleyepeters@gmail.com',
                    subject: 'Verify Your Account',
                    html: `<html>
                        			<body>
				                        <div style="text-align: center;">
					                        <div>
						                        <a href="${keys.domain}/verify/${user.token}">Confirm your account</a>
					                        </div>
				                        </div>
			                        </body>
	                        	</html>
	                        `
                }
                console.log(msg)
                sgMail.send(msg)
                    .then((response) => {
                        console.log(response[0].statusCode)
                        console.log(response[0].headers)
                    })
                    .catch(error => console.error(error.toString()))
                res.render('activation')
            }
        })
    };
})

router.get('/forgotpassword', async (req, res) => {
    res.render('resetPassword')
});

router.post('/forgotpassword', async (req, res) => {
    var email = req.body.email
    const user = await User.findOne({ "email": req.body.email })
    if (!user) {
        req.flash('error', 'Email Does not exist, Try again');
        res.redirect('/forgotpassword')
    } else {
        user.active = false;
        user.password = ''
        user.token = createRandomString(20);
        await user.save();
        const msg = {
            to: user.email,
            from: 'oluleyepeters@gmail.com',
            subject: 'Reset Your Password',
            html: `<html>
                        <body>
		                    <div style="text-align: center;">
		                        <div>
						            <a href="${keys.domain}/forgotpassword/${user.token}/resetPassword">Reset Your Password</a>
					            </div>
			                </div>
			            </body>
	            	</html>
	                        `
        }
        console.log(msg)
        sgMail.send(msg)
            .then((response) => {
                req.flash('success', 'Password reset sent to your Email Account');
                res.redirect('/')
            })
            .catch((error) => console.error(error.toString()))
    }
})

router.get('/forgotpassword/:token/resetPassword', async (req, res) => {
    const user = await User.findOne({ 'token': req.params.token });
    if (!user) {
        req.flash('error', 'no user found')
        res.redirect('/')
    } else {
        res.render('newpassword', { foundUser: user })
    }
});

router.put('/forgotpassword/:token', async (req, res) => {
    var hashedpassword = hashPassword(req.body.password)
    const user = await User.findOneAndUpdate({ 'token': req.params.token },
        { "$set": { password: hashedpassword } },
        { new: true });
    if (!user) {
        req.flash('error', 'Update cant be done, Try again')
        res.redirect('/login')
    } else {
        user.active = true;
        user.token = '';
        await user.save();
        req.flash('success', 'Password Successfully Changed')
        res.redirect('/login')
    }
});

// ===================login routes
router.get('/login', function (req, res) {
    res.render('login')
})

router.post('/login', passport.authenticate('local',
    {
        successRedirect: '/building-design',
        failureRedirect: '/login',
        failureFlash: true
    }), function (req, res) {
    });

// ==================logout
router.get('/logout', function (req, res) {
    req.logout();
    req.flash('success', 'logged you out');
    res.redirect('/building-design')
})


module.exports = router;




