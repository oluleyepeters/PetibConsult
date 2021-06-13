var express = require('express')
var router = express.Router();
var Design = require('../models/Design')
// var Comment= require('../models/Comment')
var middleware = require("../middleware")
var multer = require('multer')
var path = require('path')

const storage = multer.diskStorage({
    destination: './public/uploads',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + file.originalname)
    }
})

//init upload

const upload = multer({
    storage: storage,
    limits: { fileSize: 100000000 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb)
    }
}).single('image')


function checkFileType(file, cb) {
    //    allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    //    test
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())

    const mimetype = filetypes.test(file.mimetype)
    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only');
    }
}


router.get('/new', middleware.isloggedin, function (req, res) {
    res.render('design/NewDesign')
});

// in this case we are seeking to pull out the data from the database
router.get('/', function (req, res) {
    Design.find({}, function (err, alldesigns) {
        if (err) {
            console.log(err)
        } else
            res.render('design/Design', { designs: alldesigns, currentUser: req.user })
    })
})


router.get('/:id', function (req, res) {
    Design.findById(req.params.id).populate('comments').exec(function (err, founddesign) {
        if (err) {
            console.log(err)
        } else {
            res.render('design/ShowImage', { design: founddesign })
        }
    })
})

// This time around we are sending data into the database.
router.post("/", middleware.isloggedin, function (req, res) {
    upload(req, res, (err) => {
        if (err) {
            res.send(err)
        } else {
            if (req.file === undefined) {
                console.log('Cannot Be Undefined')
            } else {
                var fullpath = '/uploads/' + req.file.filename;
                var name = req.body.name;
                var author = {
                    id: req.user._id,
                    username: req.user.username
                }
                Design.create({
                    name: name,
                    image: fullpath,
                    author: author
                }, function (err, design) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.redirect('/building-design')
                    }
                })
            }
        }
    })
})

// ===========================Editing Campground route
router.get('/:id/edit', middleware.checkowner, middleware.checkAdmin, function (req, res) {
    Design.findById(req.params.id, function (err, founddesign) {
        res.render('design/edit', { design: founddesign });
    });
})


// =======================================Update route
router.put('/:id', middleware.checkowner, middleware.checkAdmin, function (req, res) {
    Design.findByIdAndUpdate(req.params.id,
        req.body.des, function (err, updated) {
            if (err) {
                res.redirect('/design')
            } else {
                res.redirect('/campground/' + req.params.id)
            }
        })
})

// =====================Destroy design
router.delete('/:id', middleware.checkowner, middleware.checkAdmin, function (req, res) {
    Design.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.redirect('/building-design')
        } else {
            res.redirect('/building-design')
        }
    })
})


module.exports = router;