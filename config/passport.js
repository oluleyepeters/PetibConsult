const passport= require('passport');
const LocalStrategy=require('passport-local');
const User=require('../models/User');
var crypto=require('crypto');
var flash=require('connect-flash')


passport.serializeUser((user ,done)=>{
	done(null,user.id)
})



passport.deserializeUser((id, done) => {
	User.findById(id)
	.then(user => {
		done(null,user);
	});
});


passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: false
}, function ( email, password, done){
        // 1) Check if the email already exists
        User.findOne({ 'email': email }, function(err,user){
        	if (err)
                return done(err);
            if (!user)
                return done(null, false, {message: 'User does not exist'});
            function hashPassword(str){
    			hashingSecret="fuckoff"
    			var hash= crypto.createHmac('sha256',hashingSecret).update(str).digest('hex');
    			return hash    
			}
       		newhashedPassword=hashPassword(password)
            if(newhashedPassword != user.password){
            	return done(null, false, { message: 'Unknown Password' });
        }
        if (!user.active) {
        return done(null, false, { message: 'Sorry, you must validate email first' });
        }
            return done(null, user);
        });
}));