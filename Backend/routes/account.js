const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/user');
const {Account} = require('../database/db');

router.get('/balance',authMiddleware , async(req,res)=>{
    
    const account  =  await Account.findOne({
        _id : req.userId
    })

    return res.status(200).json({
        balance : account.balance
    })
})

router.post('/transfer',authMiddleware,async(req,res)=>{
    const session = await mongoose.startSession();
    session.startTransaction();

    const {to , amount} = req.body;

    const account = await Account.findOne({_id:req.userId}).session(session);

    if(!account || account.balance < amount){
        await session.abortTransaction();
        return res.status(400).json({message : 'Insufficient balance'});
    }

    const toAccount = await Account.findOne({_id:to}).session(session);

    if(!toAccount){
        await session.abortTransaction();
        return res.status(404).json({message : 'Account not found'});
    }

    //transfer and deduct the amount

    await Account.updateOne({_id : req.userId} , {$inc : {balance : -amount}}).session(session);
    await Account.updateOne({_id : to} , {$inc : {balance : amount}}).session(session);

    await session.commitTransaction();
    return res.status(200).json({message : 'Transfer successful'});
})






module.exports = router;