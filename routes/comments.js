if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

var express = require('express')
// merge params is done to make sure that the Design is found
var router = express.Router({ mergeParams: true });
var Design = require('../models/Design')
var Comment = require('../models/Comment')
var middleware = require("../middleware")

router.get('/new', middleware.isloggedin, function (req, res) {
    // res.render('comments/NewComments')
    Design.findById(req.params.id, function (err, Design) {
        res.render('comments/new', { Design: Design })
    });
});

router.post('/', middleware.isloggedin, function (req, res) {
    Design.findById(req.params.id, function (err, Design) {
        if (err) {
            console.log(err)
            res.redirect('/building-design')
        } else {
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    req.flash('error', 'An Error Occurred Try Again')
                    res.back()
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save()
                    Design.comments.push(comment)
                    Design.save();
                    req.flash('success', 'Comment Successfully Created')
                    res.redirect('/building-design/' + Design._id)
                }
            })
        }
    })
})

// ==================Editing the comments
router.get('/:comment_id/edit', middleware.checkownerc, function (req, res) {
    Comment.findById(req.params.comment_id, function (err, foundComment) {
        if (err) {
            res.redirect('back')
        } else {
            res.render('comments/edit', { design_id: req.params.id, comment: foundComment })
        }
    })
})

// ===========================update comments
router.put('/:comment_id', middleware.checkownerc, function (req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, updated) {
        if (err) {
            res.redirect('back')
        } else {
            res.redirect('/building-design' + req.params.id)
        }
    })
})


// ==============================delete comments
router.delete('/:comment_id', middleware.checkownerc, function (req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function (err) {
        if (err) {
            res.redirect('back')
        } else {
            res.redirect('/building-design/' + req.params.id)
        }
    })
})

module.exports = router;