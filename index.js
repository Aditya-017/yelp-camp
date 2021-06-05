if(process.env.NODE_ENV!=="production"){
    require('dotenv').config()
}
const express =require('express');
const app=express();
const path=require('path')
const mongoose=require("mongoose");
const methodOverride=require("method-override")
const ExpressError = require('./utils/ExpressError');
const ejsmate =require('ejs-mate')
const campgroundRoutes=require('./routes/campground')
const reviewRoutes=require('./routes/reviews')
const session =require('express-session')
const flash =require('connect-flash')
const passport=require('passport');
const localStrategy=require('passport-local')
const User= require('./models/user')
const userRoutes=require('./routes/users')
const mongoSanitize=require('express-mongo-sanitize')
const helmet = require("helmet");
const MongoStore = require('connect-mongo');

//const dbUrl=process.env.DB_URL
const dbUrl='mongodb://localhost:27017/yelp-camp'
//getyting connectiona and specifying db name
mongoose.connect(dbUrl,
{useCreateIndex:true,
useNewUrlParser:true,
useUnifiedTopology:true,
useFindAndModify:false})

const db=mongoose.connection;
db.on("error",console.error.bind(console,"connection error"))
db.once("open",()=>{
    console.log("Database Connected")      
});


app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs')
app.engine('ejs',ejsmate)
app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname,'public')))
app.use(mongoSanitize())

const store =MongoStore.create({
    mongoUrl:dbUrl,
    
    crypto: {
        secret: 'thisshould be a bettersecret',
      },
    touchAfter: 24*3600
})

store.on('error',function(e){
    console.log(e)
})
const sessionConfig={
    store,
    name:'session',
  /*   store: MongoStore.create({
        mongoUrl:dbUrl
        }), */
    secret:'thisshould be a bettersecret',
    resave: false,
    saveUninitialized: true, 
    cookie:{
        httpOnly:true,
        //secure:true,
        expires:Date.now() + 1000*3600*24*7,
        maxAge:1000*3600*24*7

    }
}
app.use(session(sessionConfig))
app.use(helmet());

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "https://stackpath.bootstrapcdn.com/bootstrap/5.0.0-alpha1/css/bootstrap.mi"
];
//This is the array that needs added to
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/aditya1000/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

app.use(passport.initialize())
app.use(passport.session())

passport.use(new localStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(flash());

app.use((req,res,next)=>{
    res.locals.currentUser=req.user;
    //console.log(req.user)
    res.locals.success=req.flash('success')
    res.locals.error=req.flash('error')
    next();
})

app.use('/',userRoutes)
app.use('/campgrounds',campgroundRoutes)
app.use('/campgrounds/:id/reviews',reviewRoutes)



app.get('/',(req,res)=>{
    res.render('home');
})



app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err,req,res,next)=>{
    
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error',{err})
})


app.listen(3000, ()=> {
    console.log("running on 3000");
})

