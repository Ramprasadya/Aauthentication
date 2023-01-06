const express = require('express')
const router = express.Router();
const User = require('../model/User')
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const {body ,validationResult} = require('express-validator');
const fetchUser = require('../middleware/fetchUser');

const JWT_SECRET = "Ramisagood$oy"
//Route 1 : Create a user using post method  : on "/api/auth/createuser"

router.post("/createuser",[
   body('name','Enter a valid name').isLength({min:3}),
   body('email','Enter a valid Email').isEmail(),
   body('password','password must be at least 5 char').isLength({min:5}) 

],async(req,res)=>{
    // Cheack the email if aleready exists show error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // check the email already exists
    try {
        let user =await User.findOne({email : req.body.email})   // when the user already exists it show an error
   
        if(user){
            return res.status(400).json({error : "sorry a user with this email alredy exists"})
        }

        const  salt  = await bcrypt.genSalt(10)
        const secPass = await bcrypt.hash(req.body.password , salt)

        // creating a user
        user = await User.create({
            name : req.body.name,
            email : req.body.email,
            password : secPass
        })

        const data = {
            user:{
                id : user.id
            }
        }

        const authToken = jwt.sign(data , JWT_SECRET)
      
        res.json({authToken})


    } catch (error) {
        console.log(error)
        res.status(500).send("Internal server Error")
    }
   
   
})

///Route 2 : Authenticate a user  No login require 

router.post("/login",[
   
    body('email','Enter a valid Email').isEmail(),
    body('password','password can not be blank').exists()
 
 ],async(req,res)=>{

     // Cheack the email if aleready exists show error
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
       return res.status(400).json({ errors: errors.array() });
     }
     
    const {password , email} = req.body;
    try {
        let user = await User.findOne({email})
        if(!user){
            return  res.status(400).json({error : "Please try to login with correct credentials"})
        }
     
        const comparePassword = await bcrypt.compare(password , user.password)
        if(!comparePassword){
            return res.status(400).json({error : "Please try to login with correct credentials"})
        }
        const data = {
            user:{
                id : user.id
            }
        }

        const authToken = jwt.sign(data , JWT_SECRET)
      
        res.json({authToken})
    } catch (error) {
        console.log(error)
        res.status(500).send("Internal server Error")
    }
 })
 
 ///Route 2 : Get loged in to get  user detail :  login require 
 router.post("/getuser",fetchUser,async(req,res)=>{

    try {
      let userId = req.user.id
      const user = await User.findById(userId).select("-password")
      res.send(user)
    } catch (error) {
       console.log(error)
           res.status(500).send("Internal server Error")
    }
 })


module.exports = router;