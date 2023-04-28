import express from "express"
import multer from "multer"
import cors from "cors"
import mongoose from 'mongoose'
import { registerValidation,loginValidation, postCreateValidations } from "./validations.js";
import {handleErrors,checkAuth} from './utils/index.js'
import {UserControllers,PostController} from './controllers/index.js'

mongoose
  .connect('mongodb+srv://user:111@cluster0.2y2i8vy.mongodb.net/blog?retryWrites=true&w=majority')
  .then(()=>console.log('DB OK'))
  .catch((err)=>console.log('DB error',err))

const app=express()

const storage=multer.diskStorage({
  destination:(_,__,cb)=>{
    cb(null,'uploads')
  },
  filename:(_,file,cb)=>{
    cb(null,file.originalname)
  }
})

const upload=multer({storage})


app.use(express.json())
app.use(cors())
app.use('/uploads',express.static('uploads'))
app.post('/upload',checkAuth,upload.single('image'),(req,res)=>{
  res.json({
    url:`/uploads/${req.file.originalname}`,
  })
})
app.post('/auth/login',loginValidation,handleErrors,UserControllers.login)
app.post('/auth/register',registerValidation,handleErrors,UserControllers.register)
app.get('/auth/me',checkAuth,UserControllers.getMe)

app.get('/tags',PostController.getLastTags)
app.get('/posts',PostController.getAll)
app.get('/posts/tags',PostController.getLastTags)
app.get('/posts/:id',PostController.getOne)
app.post('/posts',checkAuth,postCreateValidations,handleErrors,PostController.create)
app.delete('/posts/:id',checkAuth,PostController.remove)
app.patch('/posts/:id',checkAuth,postCreateValidations,PostController.patch)


app.listen(4444,(err)=>{{
if(err){
    return console.log(err);
}
console.log("Server OK");
}})