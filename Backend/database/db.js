const mongoose = require('mongoose');


mongoose.connect('mongodb+srv://smitpatel1305:Smit2004@cluster0.udla4ro.mongodb.net/paytm').then(()=>{
    console.log('Connected to MongoDB');
}).catch(err=>console.log(err));


const userSchema = new mongoose.Schema({
    firstname : {
        type : String,
        required : true
    },
    lastname : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true,
        trim : true
    },
    password : {
        type : String,
        required : true,
        minlength : 6
    },
    balance : {
        type : Number,
        default : 0
    },
})

const accountSchema = new mongoose.Schema({
    accountHolder : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    balance : {
        type : Number,
         required : true
    }
})



const User = mongoose.model('User',userSchema);
const Account = mongoose.model('Account',accountSchema);


module.exports = {
    User,
    Account
}