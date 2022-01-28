const dotenv=require('dotenv');
const mongoose = require('mongoose');
const express=require('express');
const app =express();
app.use(express.static('public'));
const cookieParser = require('cookie-parser');
app.use(cookieParser())
dotenv.config({ path:'./config.env'})
const bodyParser = require('body-parser');
const api = express();
api.use(bodyParser.json());
api.use(bodyParser.urlencoded({ extended: true }));

require('./db/connection')
// const User =require('.db/model/userSchema');
app.use(express.json());
// link the router files to make our route easy


app.use(require('./router/auth'));

const PORT=process.env.PORT
// middleware
// const middleware=(req,res, next) =>{
//     console.log(`middleware`);
//     next();
// }
// middleware();
// app.get('/',(req,res)=>{
//     res.send(`hello response from server`)
// })
// app.get('/about',middleware,(req,res)=>{
//     console.log('this is about page')
//     res.send(`about page`)
// })

app.get('/home',(req,res)=>{
    res.send(`home`)
})
// app.get('/signin',(req,res)=>{
//     res.send(`signin`)
// })
app.get('/register',(req,res)=>{
    res.send(`register`)

})
// app.get('/contact',(req,res)=>{
//     res.send(`contact`)
// })
app.listen(PORT,()=>{
    console.log(`server is running  ${PORT}`)
})
