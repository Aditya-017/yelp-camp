const express=require('express')
const router= express.Router()
const User=require('../models/user')
const catchAsync=require('../utils/catchAsync')
const passport=require('passport')
const {isLoggedin}=require('../midleware')
const userController=require('../controllers/user')

router.route('/register')
.get(userController.renderRegister)
.post(catchAsync(userController.register))
router.route('/login')
.get(userController.renderLogin)
.post(passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),userController.login)

router.get('/logout',isLoggedin,userController.logout)
module.exports=router
