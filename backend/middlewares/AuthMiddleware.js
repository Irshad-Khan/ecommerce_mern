const ErrorHandler = require('../exceptions/ExceptionHandler')
const jwt = require('jsonwebtoken');
const User = require('../Models/User');
exports.isAuthenticatedUser = async (req,res,next) => {
    try {
        const { token } = req.cookies;
        if(!token) {
            next(new ErrorHandler('Authentication failed',401));
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        next();
    }catch(err){
        next(new ErrorHandler('Authentication failed', 401));
    }
}

exports.authorizedRoles = (...roles) =>{
    return (req, res, next) => {
        try {
            if (!roles.includes(req.user.role)) {
                return next(new ErrorHandler(`Role ${req.user.role} is not allowed to access this resource`, 403));
            }
            next();
        } catch (err) {
            next(new ErrorHandler(err, 403));
        }
    }
}