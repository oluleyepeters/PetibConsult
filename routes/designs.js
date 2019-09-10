var express= require('express')
var router=express.Router();
var Design= require('../models/Design')
// var Comment= require('../models/Comment')
var middleware=require("../middleware")


router.get('/new',middleware.isloggedin,middleware.checkAdmin, function(req,res){
    res.render('design/NewDesign')
});


// in this case we are seeking to pull out the data from the database
router.get('/',function(req,res){
    Design.find({}, function(err, alldesigns){
        if(err){
            console.log(err)
        }else
        res.render('design/Design',{designs:alldesigns, currentUser:req.user})
    })
})


router.get('/:id' , function(req,res){
    Design.findById(req.params.id).populate('comments').exec(function(err,founddesign){
        if(err){
            console.log(err)
        }else{
            res.render('design/ShowImage',{design:founddesign})
        }
    })
})

// This time around we are sending data into the database.
router.post("/",middleware.isloggedin,middleware.checkAdmin, function(req,res){
	var name= req.body.name;
    var image= req.body.image;
    var author={
        id:req.user._id,
        username:req.user.username
    }
	Design.create({
        name:name,
        image:image,
        author:author
    }, function(err,design){
        if(err){
            console.log(err);
        }else{
            res.redirect('/design')
        }
    });	
})

// ===========================Editing Campground route
router.get('/:id/edit',middleware.checkowner,middleware.checkAdmin, function(req,res){
        Design.findById(req.params.id, function(err,founddesign){
            res.render('design/edit', {design:founddesign});     
        });
    })


// =======================================Update route
router.put('/:id',middleware.checkowner, function(req,res){
    Design.findByIdAndUpdate(req.params.id,
    req.body.des, function(err, updated){
        if(err){
            res.redirect('/design')
        }else{
            res.redirect('/campground/'+req.params.id)
        }
    })
})

// =====================Destroy design
router.delete('/:id',middleware.checkowner, function(req,res){
    Design.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect('/design')
        }else{
            res.redirect('/design')
        }
    })
})


module.exports= router;