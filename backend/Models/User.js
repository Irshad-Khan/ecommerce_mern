const mongoose = require('mongoose');
const Validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Name field is required'],
        minlength: [3,'Name field must be at least 3 characters'],
        maxLength: [30,'Name field must be at most 30 characters']
    },
    email:{
        type: String,
        required: [true, 'Email field is required'],
        unique: true,
        validate:[Validator.isEmail,'Please enter a valid email']
    },
    password:{
        type: String,
        required: [true, 'Password field is required'],
        minlength: [8,'Password field must be at least 8 characters'],
        select: false // Mean when we apply elect query it not included in list
    },
    avatar:{
        public_id:{
            type: String,
            required: true
        },
        url:{
            type: String,
            required: true
        }
    },
    role:{
        type: String,
        default: 'user'
    },
    isActive:{
        type: Boolean,
        default: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    updatedAt:{
        type: Date,
        default: Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
});

// Middleware to encrypt password before saving
userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password,10);
    next();
});

// Return JWT Token
userSchema.methods.getJwtToken = function(){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_EXPIRE});
};

// Compare password
userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User',userSchema);