const User = require('../../Models/User')

const  ErrorHandler = require('../../exceptions/ExceptionHandler');
const sendToken = require('../../utils/JwtToken')
const sendEmail = require('../../utils/SendEmail');
const crypto = require('crypto');
exports.registerUser = async (req, res, next) =>{
  try {
   const{ name, email, password } = req.body;
   const user = await User.create({
       name,
       email,
       password,
       avatar:{
           public_id: 'irshad_nyfk5o',
           url: 'https://res.cloudinary.com/dblnuw8pp/image/upload/v1740149111/irshad_nyfk5o.png'
       }
   });

   sendToken(user,200,res)
  }catch (error) {
      var message = error.message;
     if (error.code === 11000){
         messages = "Email Address already be taken"
     }
      return next(new ErrorHandler(messages,error.statusCode))
  }
};

exports.login = async (req, res, next) => {
    try {
     const {email, password } = req.body;
     if(!email || !password){
         return next(new ErrorHandler('Please provide email and password', 400));
     }
     const user = await User.findOne({email}).select('+password');
     if(!user || !(await user.comparePassword(password))){
         return next(new ErrorHandler('Invalid email or password', 401));
     }
     sendToken(user,200,res)
     // const token = user.getJwtToken();
     // res.json({
     //     success: true,
     //     message: 'User logged in successfully',
     //     token
     // });
    }catch (error) {
        return next(new ErrorHandler(error.message, error.statusCode))
    }
}

exports.logout = (req,res,next) => {
    try {
        res.cookie('token', null,{
            expires: new Date(Date.now()),
            httpOnly: true,
        });
        res.status(200).json({
            success: true,
            message: 'User logged out successfully',
        });
    }catch (error) {
        return next(new ErrorHandler(error.message, error.statusCode))
    }
}

exports.forgotPassword = async (req,res,next) => {
    try {
        let user = await User.findOne({email: req.body.email});
        if(!user){
            return next(new ErrorHandler('User not found with this email', 404));
        }
        const resetToken = await user.getResetPasswordToken();
        await user.save({validateBeforeSave: false});
        const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;
        const message = `Your password reset link is as follows:\n\n ${resetUrl}\n\nif you have
        not requested this, please ignore this email and your password will remain unchanged.`;

        await sendEmail({
            to: user.email,
            subject: 'Password Reset Link',
            message
        });

        res.status(200).json({
            success: true,
            message: `Reset password email sent successfully to ${user.email}`,
        });

    }catch (err){
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({validateBeforeSave: false});
        return next(new ErrorHandler(err.message, err.statusCode));
    }
}

exports.resetPassword = async (req,res,next) => {
    try {
        const resetPasswordToken = crypto.createHash('sha256')
            .update(req.params.token)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordToken: resetPasswordToken,
            resetPasswordExpire: {$gt: Date.now()}
        });
        if(!user){
            return next(new ErrorHandler('Password reset token is invalid or has expired', 400));
        }
        if(req.body.password !== req.body.confirmPassword){
            return next(new ErrorHandler('Passwords do not match', 400));
        }
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        sendToken(user,200,res);

    }catch (error) {
        return next(new ErrorHandler(error.message, error.statusCode))
    }
}

exports.profile = async (req, res, next) => {
    try{
        const user = await User.findById(req.user.id).select('-password');
        res.json({
            success: true,
            user
        });
    }catch (error) {
        return next(new ErrorHandler(error.message, error.statusCode))
    }
}

exports.updatePassword = async (req, res, next) => {
    try{
        const user = await User.findById(req.user.id).select('+password');
        // console.log(user)
        if(!(await user.comparePassword(req.body.currentPassword))){
            return next(new ErrorHandler('Current password is incorrect', 401));
        }
        user.password = req.body.newPassword;
        await user.save();
        sendToken(user,200,res);
    }catch (error) {
        // console.log(error)
        return next(new ErrorHandler(error.message, error.statusCode))
    }
}

exports.updateProfile = async (req,res,next) =>{
    try {
        const user = await User.findByIdAndUpdate(req.user.id, req.body,
            {new: true, runValidators: true});

        res.json({
            success: true,
            user
        });
    }catch (error) {
        return next(new ErrorHandler(error.message, error.statusCode))
    }
}

exports.allUsers = async (req, res, next) =>{
    try {

        const users = await User.find();
        res.json({
            success: true,
            users
        });
    }catch (error) {
        return next(new ErrorHandler(error.message, error.statusCode))
    }
}

exports.userById = async (req, res, next) =>{
    try {
        const user = await User.findById(req.params.id);
        if(!user){
            return next(new ErrorHandler('User not found', 404));
        }
        res.json({
            success: true,
            user
        });
    }catch (error) {
        return next(new ErrorHandler(error.message, error.statusCode))
    }
}

exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if(!user){
            return next(new ErrorHandler('User not found', 404));
        }
        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, error.statusCode))
    }
}

exports.updateUser = async (req,res,next)=>{
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body,
            {new: true, runValidators: true});

        res.json({
            success: true,
            user
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, error.statusCode))
    }
}