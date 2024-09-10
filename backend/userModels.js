
const mongoose = require ("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    }, 
    lastName: {
        type: String,
    },
    userName : {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minLenghth: 5,
        maxLength: 20
    },
    password: {
        type: String,
        required: true,
        minLenghth: 6
    }
})

const accountsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true

    },
    balance: {
        type: Number,
        required: true
    }
})

const Account = mongoose.model('Account', accountsSchema)
const User = mongoose.model('User', userSchema);


module.exports= {
    User,
    Account
}
