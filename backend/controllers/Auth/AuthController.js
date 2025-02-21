const User = require('../../Models/User')

const  ErrorHandler = require('../../exceptions/ExceptionHandler');

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

   const token = user.getJwtToken()
   res.status(201).json({
       success: true,
       message: 'User registered successfully',
       token
   });
  }catch (error) {
      return next(new ErrorHandler(error.message,error.statusCode))
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
     const token = user.getJwtToken();
     res.json({
         success: true,
         message: 'User logged in successfully',
         token
     });
    }catch (error) {
        return next(new ErrorHandler(error.message, error.statusCode))
    }
}