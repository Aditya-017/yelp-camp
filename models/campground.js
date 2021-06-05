const mongoose = require("mongoose");
const Review=require("./review") 
const schema=mongoose.Schema
const ImageSchema=new schema({
   url:String,
   filename:String
})
ImageSchema.virtual('thumbnail').get(function(){
  return this.url.replace('/upload','/upload/w_200')
})


const opts = { toJSON: { virtuals: true } };
const campgroundSchema=new schema({
   title:String,
   images:[ImageSchema],
   geometry:{
      type:{
         type:String,
         enum:['Point'],
         required:true

      },
      coordinates:{
         type:[Number],
         require:true
      }
   },
   price:Number,
   description:String,
   location:String,
   reviews:[{
      type:schema.Types.ObjectId,
      ref:'Review'
   }],
   author:{
      type:schema.Types.ObjectId,
      ref:'User'
   }
},opts);

campgroundSchema.virtual('properties.popUpMarkup').get(function(){
 //  return "i am popupp"
   return `<a href="/campgrounds/${this._id}">${this.title}</a>`
   
 });

campgroundSchema.post('findOneAndDelete',async function(doc){
if(doc){
   await Review.remove({
      _id:{
         $in:doc.reviews
      }
   })
}
})

module.exports=mongoose.model('Campground',campgroundSchema);

