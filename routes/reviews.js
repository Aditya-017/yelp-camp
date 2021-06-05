const express=require('express')
const router=express.Router({mergeParams: true})
const catchAsync = require('../utils/catchAsync');
const {validateReview,isLoggedin,isReviewAuthor}=require('../midleware')
const reviewController=require('../controllers/review')



router.post('/' ,isLoggedin,validateReview,catchAsync(reviewController.createReview))
 
 router.delete('/:reviewId' ,isLoggedin,isReviewAuthor,catchAsync(reviewController.deleteReview))

 module.exports=router;