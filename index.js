import express from "express"
import mongoose from 'mongoose'
import { registerValidation,loginValidation, postCreateValidations } from "./validations.js";
import checkAuth from './utils/chechAuth.js'
import * as UserControllers from './controllers/UserControllers.js'
import * as PostController from './controllers/PostController.js'
mongoose
  .connect('mongodb+srv://user:111@cluster0.2y2i8vy.mongodb.net/blog?retryWrites=true&w=majority')
  .then(()=>console.log('DB OK'))
  .catch((err)=>console.log('DB error',err))
const app=express()
app.use(express.json())

app.post('/auth/login',loginValidation,UserControllers.login)
app.post('/auth/register',registerValidation,UserControllers.register)
app.get('/auth/me',checkAuth,UserControllers.getMe)


app.get('/posts',PostController.getAll)
app.get('/posts/:id',PostController.getOne)
app.post('/posts',checkAuth,postCreateValidations,PostController.create)
app.delete('/posts/:id',checkAuth,PostController.remove)
app.patch('/posts/:id',checkAuth,PostController.patch)


app.listen(4444,(err)=>{{
if(err){
    return console.log(err);
}
console.log("Server OK");
}})