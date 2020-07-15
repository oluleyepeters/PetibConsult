var mongoose=require('mongoose')
var passportLocalmongoose=require('passport-local-mongoose')

var UserSchema=new mongoose.Schema({
	email:String,
	active:{type:Boolean, default:true},
    username:String,
    password:String,
    token:String
});

UserSchema.plugin(passportLocalmongoose)

module.exports=mongoose.model('Users', UserSchema);