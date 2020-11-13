const mongoose = require('mongoose');

const customerSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    username:{
        type: String,
        require: true,
        unique: true
    },
    email:{
        type: String,
        require: true,
        unique: true
    },
    balance:{
        type: Number,
        min: 0,
        require: true,
    }
})

const Customer = mongoose.model('Customer',customerSchema);

module.exports=Customer;

