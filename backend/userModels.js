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

export const User = mongoose.model(User, userSchema);

