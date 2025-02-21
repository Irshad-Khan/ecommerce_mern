const ErrorHandler = require('../exceptions/ExceptionHandler');
const dotenv = require('dotenv');

dotenv.config({path: "backend/config/config.env"})
module.exports = (err,req,res,next) => {
    err.statusCode = err.statusCode || 500;

    if (process.env.NODE_ENV === "DEVELOPMENT") {
        res.status(err.statusCode).json({
            success: false,
            error: err,
            message: err.message,
            stack: err.stack,
        });
    }
    if (process.env.NODE_ENV === "PRODUCTION") {
        let error = { ...err }
        error.message = err.message;

        if(err.name === 'CastError') {
            const message = `Resource not found. Invalid: ${err.path}`;
            error = new ErrorHandler(message,400)
        }

        if(err.name === 'ValidationError') {
            const message = Object.values(err.errors).map(value => value.message);
            error = new ErrorHandler(message,400)
        }

        console.log(err.name)
        res.status(error.statusCode).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }

}