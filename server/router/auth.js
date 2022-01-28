const jwt=require('jsonwebtoken');
const express=require('express');
const router=express.Router();
require('../db/connection')
const bcrypt=require('bcryptjs');
const User =require('../model/userSchema')
const authenticate= require('../middleware/authenticate')
router.get('/',(req,res)=>{
    res.send(`hello response from server router js`)
})
// using promises
// router.post('/register', (req,res)=>{
//     const {name, email, phone ,  password, work}=req.body;
//     if(!name || !email || !phone || !password || !work ) {
//         return res.status.json({error:"kindly filled the field properly"});
//     }
//     User.findOne({email:email})
//     .then((userExist) =>{
//         if(userExist){
//             return res.status(422).json({error: "email already exist"})
//         }
//         const user =new User({name, email,phone,work,password});
//         user.save().then(()=>{
//             res.status(201).json({message:"user registered succesfully"});
//         }).catch((err)=>res.status(500).json({error:"failed to registered"}))
//     }).catch(err=>{console.log(err) });
//     // console.log(req.body.email);
//     // res.send('this is running')
//     // res.json({message:req.body});
// })
// using async await
router.post('/register',async (req,res)=>{
    const {name, email, phone ,password, cpassword, work }=req.body;
    if(!name || !email || !phone || !password || !cpassword|| !work) {
        return res.status(422).json({error:"kindly filled the field properly"});
    }
        try{
         const userExist= await  User.findOne({email:email});

         if(userExist){
            return res.status(422).json({error: "email already exist"});
        }
        else if(password != cpassword){
            return res.status(422).json({error: "password are not matching"});
        }else{
            const user =new User({name,})
        }

        const user =new User({name, email,  phone,  password, cpassword, work});
       const userRegister= await user.save();
        if (userRegister){
            res.status(201).json({message:"user registered succesfully"});
        }
        else{
            res.status(500).json({error:"failed to registered"})    
        }
    }
  catch (err){
        console.log(err)
     
}    

})
// // login setup practice
// router.post('/signin', (req, res)=>{
//     console.log(req.body.email);
//     res.json({message:"success"});
// })
// login setup
router.post('/signin',async(req,res)=>{
    try{
        let token;
        const{email,password} =req.body;
        if(!email ||!password){
            return res.status(400).json({error:'plz filled the data'})
        }
        const userLogin=await User.findOne({email:email});

        // console.log(userLogin);

        // if(!userLogin){
        //     res.status(400).json({error:"user error"})
        // }
        if(userLogin){
            const isMatch =await bcrypt.compare(password,userLogin.password);
             token =await userLogin.generateAuthToken();
             console.log(token);
             res.cookie("jwttoken" ,token ,{
                 expires:new Date(Date.now() +25892300000),
                 httpOnly:true
             });
            if(!isMatch){
                res.status(400).json({error:"Invalid credential;"});
            }
            else{
                res.json({message:"user signin succesfully"})
            }
        
        }else{
            res.status(400).json({error:"Invalid credential;"});
        }
    }
        catch(err){
            
            console.log(err)
        }
})
// about us ka page
router.get('/about',authenticate,(req,res)=>{
    console.log('this is about page')
    res.send(`req.rootUser`)
});
router.get('/getdata',authenticate,(req,res)=>{
    console.log('this is contact page')
    res.send(`req.rootUser`)
})
router.post('/contact',authenticate,async(req,res)=>{
    try{
        const {name, email, phone ,message}=req.body;
        if(!name || !email || !phone || !password || !message) {
            return res.json({error:"kindly filled the contact form"});
        }
        const userContact= await  User.findOne({_id:req.userID});

        if(userContact){
            const userMessage= await userContact.addMessage(name, email, phone ,message);
            await  userContact.save();
            res.status(201).json({message:"user contact successfully"});
        }
    }
    catch(error){
        console.log(error)

    }
})
// logout page
router.get('/logout',(req,res)=>{
    console.log('this is logout page')
    res.clearCookie(`jwtoken`,{path:'/'});
    res.status(200).send(`user logout`)

});

module.exports=router;

 