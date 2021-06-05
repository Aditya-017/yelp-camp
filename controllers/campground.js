const campground = require('../models/campground');
const {cloudinary}=require('../cloudinary')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxtoken=process.env.MAPBOX_TOKEN
const geocoder= mbxGeocoding({ accessToken: mapboxtoken });
module.exports.index=async(req,res)=>{
    const campgrounds=await campground.find({})
    res.render('campgrounds/index',{campgrounds})
}

module.exports.renderNewForm=(req,res)=>{
    res.render('campgrounds/new');
 }

 module.exports.createCampground=async(req,res,next)=>{
    const geodata=await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
      }).send()
        
       
     //res.send("ok!") 
    const camp=new campground(req.body.campground)
    camp.geometry= geodata.body.features[0].geometry
    camp.images=req.files.map(f=>({url:f.path,filename:f.filename}))
    camp.author=req.user._id;
    await camp.save()
    console.log(camp)
    req.flash('success','Campgrund Created')
    res.redirect(`/campgrounds/${camp._id}`)
}

module.exports.showCampground=async(req,res)=>{
    const {id}=req.params;
    const camp= await campground.findById(id).populate({
        path:'reviews',
        populate:{
            path:'author'}
        }).populate('author');
    //console.dir(camp.author)
    if(!camp){
    req.flash('error','Campground Not Found')
    return res.redirect('/campgrounds')
}
//console.log(camp)
    res.render('campgrounds/show',{camp})   
}

module.exports.renderEditForm=async(req,res)=>{
    const {id}=req.params;
    const camp=await (await campground.findById(id));
    if(!camp){
        req.flash('error','Campground Not Found')
        return res.redirect('/campgrounds')
    }
    //console.log(camp)
    //return res.send(camp)
    res.render('campgrounds/edit',{camp})  

}

module.exports.updateCampground=async(req,res)=>{
   
    const {id}=req.params;
    const camp=await campground.findByIdAndUpdate(id,{...req.body.campground})
    const images=req.files.map(f=>({url:f.path,filename:f.filename}))
    if(images.length>0){
    camp.images.push(...images)
    }
    console.log(images)
  
    await camp.save()
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
            
        }
        const result=await camp.update({$pull:{images:{filename:{$in: req.body.deleteImages}}}})
        //console.log(result.n,result.nModified)
   }
   
    req.flash('success','succesfully updated campground')
    res.redirect(`/campgrounds/${camp._id}`) 
}

module.exports.deleteCampground=async(req,res)=>{
    const {id}=req.params;
    await campground.findByIdAndDelete(id);
    req.flash('success','Campground deleted')
    res.redirect('/campgrounds');

}