import express from "express"
import bcrypt from "bcrypt"
import {validationResult} from 'express-validator'
import mongoose from 'mongoose'
import { registerValidation } from "./validations/auth.js";

import userModel from "./modules/User.js"

mongoose
  .connect('mongodb+srv://user:111@cluster0.2y2i8vy.mongodb.net/blog?retryWrites=true&w=majority')
  .then(()=>console.log('DB OK'))
  .catch((err)=>console.log('DB error',err))
const app=express()
app.use(express.json())


app.post('/auth/register',registerValidation,async(req,res)=>{
 try{
  const errors=validationResult(req)
  if(!errors.isEmpty()){
    return res.status(400).json(errors.array())
  }

  const password=req.body.password;
  const salt=await bcrypt.genSalt(10)
  const passwordHash=await bcrypt.hash(password,salt)
  const doc= new userModel({
    email:req.body.email,
    fullName:req.body.fullName,
    avatarUrl:req.body.avatarUrl,
    passwordHash
  })

  const user= await doc.save()

  res.json(user)

 }catch(err){
  console.log(err);
    res.status(500).json({
      message:"Не удалось зарегестрироваться",
    })
 }
})

app.listen(4444,(err)=>{{
if(err){
    return console.log(err);
}
console.log("Server OK");
}})