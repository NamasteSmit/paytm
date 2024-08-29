const express = require('express');
const router =express.Router();
const {User,Account} = require('../database/db');
const bcrypt = require('bcryptjs');
const userSchemaValidator = require('../middleware/validate');
const UserValidateSchema = require('../Input-validation/input-validator');
const jwt = require('jsonwebtoken');
const {JWT_SECRET_KEY} = require('../config');
const userMiddleware = require('../middleware/user');
const zod = require('zod');

router.post('/signup',userSchemaValidator(UserValidateSchema) ,async(req,res)=>{
     const {firstname ,lastname ,email ,password} = req.body;

     const user = await User.findOne({firstname : firstname, lastname : lastname, email : email});

     if(user){
         return res.status(400).json({message : 'User already exists'});
     }

     const hashedPassword = await bcrypt.hash(password,10);

    const newuser = await User.create({
        firstname : firstname,
        lastname : lastname,
        email : email,
        password : hashedPassword
    })
 
    const token = jwt.sign({firstname : newuser.firstname, lastname : newuser.lastname , email : newuser.email, userId : newuser._id} , JWT_SECRET_KEY);
  
     const account = await Account.create({
        accountHolder : newuser._id,
        balance : Math.floor(Math.random() *10000)
     })
     
    return  res.status(200).json({
        message : 'User registered successfully',
        user : newuser,
        token : token,
        account : account
    })
})

const signInBody = zod.object({
    email : zod
   .string({required_error : "email is required"})
   .trim()
   .email({message : "email must be valid"}),

   password : zod
   .string({required_error : "password is required"})
   .trim()
   .min(8,{message : "password must be at least 6 characters"})
})

router.post('/signin',async(req,res)=>{
 
      const {firstname, lastname , email , password} = req.body;


      const success = signInBody.safeParse({email ,password});

      if(!success){
        return res.status(400).json({
             message : "Invalid email or password"
        })
      }

      const user = await User.findOne({email : email});
      if(!user){
        return res.status(400).json({
             message : "User not found"
        })
      }
       
      const isMatch = bcrypt.compare(password ,user.password);
      if(!isMatch){
        return res.status(400).json({
             message : "Invalid password"
        })
      }

     const token = jwt.sign({firstname : firstname, lastname : lastname, email : email} , JWT_SECRET_KEY);

    return res.status(200).json(
        {
            message : 'User logged in successfully',
            token : token,
        }
    )
})


const updateBody = zod.object({
    firstname : zod
    .string({
        required_error : "firstname is required",
    })
    .trim()
    .min(3,{message : "minimum required 3 characters"})
    .max(50,{message : "maximum allowed 50 characters"})
    .optional()
    ,

    lastname : zod.string({
        required_error : "lastname is required",
    })
    .trim()
    .min(3,{message : "minimum required 3 characters"})
    .max(50,{message : "maximum allowed 50 characters"})
    .optional()
    ,

     password : zod
     .string({required_error : "password is required"})
     .trim()
     .min(8,{message : "password must be at least 6 characters"})
     .max(50,{message : "password must be atmost 50 characters"})
     .optional()
})

router.post('/update-info',userMiddleware,async(req,res)=>{
    const {firstname, lastname, password} = req.body;

    const {success} = updateBody.safeParse({firstname, lastname, password});

    if(!success){
        return res.status(400).json({
            message : "Invalid data"
        })
    }

    const updatedUser = await User.updateOne({_id : req.userId} , req.body);

    return res.status(200).json({
        message : "User info updated successfully",
    })
})


module.exports = router;