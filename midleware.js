const ExpressError = require('./utils/ExpressError');
const {campgroundSchema,reviewSchema}=require('./schemas.js')
const campground = require('./models/campground');
const Review= require('./models/review');
module.exports.isLoggedin = (req,res,next)=>{

    //console.log((req.user)?true:false)
    if(!req.isAuthenticated()){
        //Storing url user requested when not logged in
        req.session.returnTo=req.originalUrl
        req.flash('error','You Must be Signed In')
        return res.redirect('/login')
    }
    next();
}

module.exports.validateCampground=(req,res,next)=>{
   
    const {error}=campgroundSchema.validate(req.body)
    if(error){

        const msg=error.details.map(el=>el.message)
        throw(new ExpressError(msg,404))
    }
    else{
    next(); 
    }
}
module.exports.isAuthor=async (req,res,next)=>{
    const {id}=req.params
    const camp=await campground.findById(id)
    if(!camp.author.equals(req.user._id)){
        req.flash('error',"Not Allowed")
        return res.redirect(`/campgrounds/${id}`)
}else
next();
    
}

module.exports.validateReview=(req,res,next)=>{
    const{error}=reviewSchema.validate(req.body)
    if(error){
        const msg=error.details.map(el=>el.message)
        throw(new ExpressError(msg,404))
    }
    else{
        next();
        }
}

module.exports.isReviewAuthor=async (req,res,next)=>{
    const {id,reviewId}=req.params
    const review=await Review.findById(reviewId)
    if(!review.author.equals(req.user._id)){
        req.flash('error',"Not Allowed")
        return res.redirect(`/campgrounds/${id}`)
}else
next();
    
}