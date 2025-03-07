const sendToken = (user,statusCode,res) =>{
    const token = user.getJwtToken();

    const options = {
        expire: new Date(
            Date.now() + process.env.JWT_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    }
    res.status(statusCode).cookie('token',token,options).json({
        success: true,
        message: 'Token generated successfully',
        token,
        user
    });
}

module.exports = sendToken;