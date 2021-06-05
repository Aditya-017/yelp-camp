const mongoose=require("mongoose");
const Campground=require('../models/campground');
const cities=require('./cities')
const { places, descriptors } = require('./seedHelpers');

mongoose.connect('mongodb+srv://Aditya:7p)!X[;)P+=6yk`*@cluster0.ww9rf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',{useCreateIndex:true,useNewUrlParser:true,useUnifiedTopology:true})

const db=mongoose.connection;
db.on("error",console.error.bind(console,"connection error"))
db.once("open",()=>{
    console.log("Database Connected")      
});

const sample = array => array[Math.floor(Math.random() * array.length)];
const seedDB =async ()=>{
    await Campground.deleteMany({});
    for (let i = 0; i < 25; i++) {
        const rand=Math.floor(Math.random()*1000);
        const price=Math.floor(Math.random()*20)+10;
        const camp=new Campground  ({
            location:`${cities[rand].city},${cities[rand].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            geometry : { 
              type : "Point",
              coordinates : [cities[rand].longitude,cities[rand].latitude] 
              },
            images:[
                {
                
                  url: 'https://res.cloudinary.com/aditya1000/image/upload/v1621323538/YelpCamp/s5jr4knfysl6lvcwevlm.jpg',
                  filename: 'YelpCamp/s5jr4knfysl6lvcwevlm'
                },
                {
                  
                  url: 'https://res.cloudinary.com/aditya1000/image/upload/v1621323538/YelpCamp/s5jr4knfysl6lvcwevlm.jpg',
                  filename: 'YelpCamp/ww1xu6wkdv6fx1cqyfja'
                }
              ],
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos id aspernatur, incidunt natus sequi sit hic qui nostrum vitae tempore magni recusandae fuga molestias adipisci dicta deleniti, earum ducimus porro?Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos id aspernatur, incidunt natus sequi sit hic qui nostrum vitae tempore magni recusandae fuga molestias adipisci dicta deleniti, earum ducimus porro?',
            price:price,
            author:"60bb2c3aa3e353124cfbccb1"
        })
        await camp.save();
        
    }

}
seedDB();