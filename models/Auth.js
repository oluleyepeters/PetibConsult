var mongoose=require('mongoose')

var mailSchema=new mongoose.Schema({
    author:{
    	id:{
    		type:mongoose.Schema.Types.ObjectId,
    		ref:'User'
    	},
    	username:String
    },
    title:String,
    body:String,
    recipients:String,
    subject:String,
    token:String
});

module.exports=mongoose.model('Mail', mailSchema);