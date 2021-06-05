const User=require('../models/user')

module.exports.renderRegister=(req,res)=>{
    res.render('user/register')
}

module.exports.register=async(req,res,next)=>{
    try{
    const {email,username,password}=req.body
    const user =new User({email,username})
    const registeredUser =await User.register(user,password)
    //console.log(registeredUser)
    req.login(registeredUser,err=>{
        if(err) return next(err)
        req.flash('success','You are successfully registered')
    res.redirect('/campgrounds')
    })

    }catch(e){
        req.flash('error',e.message)
        res.redirect('/register')
    }
}

module.exports.renderLogin=(req,res)=>{
    res.render('user/login')
}
module.exports.login=(req,res)=>{
    req.flash('success',`Welcome Back ${req.body.username}`)
    const redirectUrl=req.session.returnTo || '/campgrounds'
   delete req.session.returnTo
    res.redirect(redirectUrl)
}

module.exports.logout=(req,res)=>{
    req.logout()
    
    req.flash('success',"Logged out")
    res.redirect('/campgrounds')
}