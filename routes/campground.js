const express=require('express')
const router=express.Router()
const catchAsync = require('../utils/catchAsync');
const campground = require('../models/campground');
const {isLoggedin,isAuthor,validateCampground}=require('../midleware')
const campgroundController=require('../controllers/campground')
const multer=require('multer')
const storage=require('../cloudinary')
const upload=multer(storage)


 router.route('/')
.get(catchAsync(campgroundController.index))
.post(isLoggedin,upload.array('img'),validateCampground,catchAsync(campgroundController.createCampground))
/* router.post('/',upload.single('img'),(req,res)=>{
    console.log(req.body,req.file)
    res.send("worked")
}) */
router.get('/new',isLoggedin,campgroundController.renderNewForm)

router.route('/:id')
.get(catchAsync(campgroundController.showCampground))
.put(isLoggedin,isAuthor,upload.array('img'),validateCampground,catchAsync(campgroundController.updateCampground))
.delete(isLoggedin,isAuthor, catchAsync(campgroundController.deleteCampground))


router.get('/:id/edit',isLoggedin,isAuthor, catchAsync(campgroundController.renderEditForm))


module.exports=router;