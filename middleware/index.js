// All the middleware comes here
var Design=require('../models/Design')
var Comment=require('../models/Comment')
var middlewareObj={};


middlewareObj.isloggedin=function (req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error','You need to be logged in to do that');
    res.redirect('/login')
}



middlewareObj.checkowner=function(req,res,next){
    if(req.isAuthenticated()){
        Design.findById(req.params.id, function(err,founddesign){
        if(err){
            req.flash('error','Design Not Found')
            res.redirect('/design')
        }else{
            if(founddesign.author.id.equals(req.user._id)){
               next();   
            }else{
                req.flash('error','You dont Have The permission')
                res.redirect('back')
            }
        }
    })     
    }else{
        req.flash('error','You need To Be Logged In To Do That')
        res.redirect('back')
    }
}


middlewareObj.checkownerc=function(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err,foundcomment){
        if(err){
            req.flash('error','An Error Occurred')
            res.redirect('back')
        }else{
            if(foundcomment.author.id.equals(req.user._id)){
               next();   
            }else{
                req.flash('error','You Dont Have The Permission To Do That')
                res.redirect('back')
            }
        }
    })     
    }else{
        req.flash('error','You need To Be Logged In')
        res.redirect('back')
    }
}


middlewareObj.checkAdmin=function(req,res,next){
    if(req.isAuthenticated()){
        if(req.user.username === 'oluleyepeters'){
            next()
        }else{
            req.flash('error','Permission not granted')
            res.redirect('back')
        }
    }else{
        req.flash('error','You need to be logged in')
        res.redirect('back')
    }
}

module.exports=middlewareObj