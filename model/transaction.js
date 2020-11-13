const mongoose = require('mongoose');

const transactionSchema= new mongoose.Schema({
    sender:{
        type:String,
        required:true,
        trim:true
    },
    receiver:{
        type: String,
        require: true,
    },
    amount:{
        type: Number,
        min: 1,
        require: true,
    },
    createdAt:{
        type: Date,
        default: Date.now(),
    }
})

const Transaction = mongoose.model('Transaction',transactionSchema);

module.exports=Transaction;

