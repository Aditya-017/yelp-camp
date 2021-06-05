const campground = require('../models/campground');
const Review= require('../models/review');

module.exports.createReview=async(req,res)=>{
    // console.log("itting route")
     const {id}=req.params
     const camp=await campground.findById(id)
     const rev=new Review(req.body.review)
     rev.author=req.user._id
     camp.reviews.push(rev);
     await rev.save()
     await camp.save()
     req.flash('success','created new review')
     res.redirect(`/campgrounds/${camp._id}`);
 }

 module.exports.deleteReview=async(req,res)=>{
    const{id,reviewId}=req.params;
    await campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId);
    //console.log("in")
    req.flash('success','Review deleted')
    res.redirect(`/campgrounds/${id}`);
}