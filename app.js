const  PORT = process.env.PORT || 3000
const express= require('express');
const app = express();
const mongoose =require('mongoose');
const Customer = require('./model/customer');
const Transaction = require('./model/transaction');
const dotenv =require('dotenv').config('./config.env');

console.log(process.env)

app.use(express.urlencoded({extended:true}));
app.use(express.json(true));
//===============SERVING STATIC FILE=====================//
app.use(express.static('public'))

//===============SETTING TEMPLATING ENGINE=====================//
app.set('view engine','ejs');
app.set('views','views');

//===============DATABASE CONNECTION=====================//
mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.t2sgy.mongodb.net/<dbname>?retryWrites=true&w=majority`,{ useNewUrlParser: true, useUnifiedTopology: true },(err)=>{
if(!err){
    console.log('DB connected!');
}
})

app.get('/',(req,res,next)=>{

res.render('index');
})

app.get('/banking',async(req,res,next)=>{
    const customers =await Customer.find({});
    res.render('banking',{customers});
})

app.get('/about',(req,res,next)=>{
    res.render('about');
})

app.get('/contact',(req,res,next)=>{
    res.render('contact');
})

app.get('/transactions',async(req,res,next)=>{
    const transactions= await Transaction.find({})
    res.render('transactions',{transactions});
})

app.post('/pay',async(req,res,next)=>{
   if(!req.body.username) return res.send("Please provide a valid username");
    const user = await Customer.findOne(req.body);
    const customers =await Customer.find({});
   if(!user) return res.send("Please provide a valid username");
    res.render('pay',{user,customers});
})


app.get('/pay/:username',async(req,res,next)=>{
     const user = await Customer.findOne(req.params);
     const customers = await Customer.find({});
    if(!user) return res.send("Please provide a valid username");
     res.render('pay',{user,customers});
 })

app.post('/transfer/:username',async(req,res,next)=>{
    //Get sender details
    const {amount,recipient} = req.body;
    console.log(req.body)
    const sender = await Customer.findOne(req.params);
    const receiver = await Customer.findOne({username:req.body.recipient});
    if(!receiver){
        return  res.json({
        status:400,
        message:"User does not exist"});  
    }
     if(amount>sender.balance){
      return  res.json({
          status:401,
          message:"Insufficient fund"
      });
    }
    await Customer.findByIdAndUpdate(sender._id,{balance: sender.balance-amount*1});
    await Customer.findByIdAndUpdate(receiver._id,{balance: receiver.balance+ amount*1});
    await Transaction.create({sender:sender.name, receiver: receiver.name, amount: amount*1})
    return  res.json({
        status:200,
        message:"Success"
    });
   
})
app.listen(PORT,()=>{
    console.log('server is running on port 3000');
})
