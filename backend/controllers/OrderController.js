const ErrorHandler = require('../exceptions/ExceptionHandler')
const Order = require('../Models/Order');
const Product = require('../Models/Product');
exports.newOrder = async (req,res,next) => {
    try{
    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingRate,
        totalPrice,
        paymentInfo,
    } = req.body;
    const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingRate,
        totalPrice,
        paymentInfo,
        paidAt: Date.now(),
        user: req.user._id
    });
    res.status(200).json({
            success: true,
            message: 'Order placed successfully',
            data: order
        });
    }catch(error){
        return next(new ErrorHandler(error.message,error.statusCode))
    }
}

exports.orderById = async (req,res,next) => {
    try {
        const order = await Order.findById(req.params.id).populate('user orderItems.product');
        if(!order){
            return next(new ErrorHandler('Order not found',404))
        }
        res.status(200).json({
            success: true,
            data: order
        });
    }catch(error){
        return next(new ErrorHandler(error.message,error.statusCode))
    }
}

exports.getUserOrders = async (req,res,next) => {
    try {
        const orders = await Order.find({user: req.user._id}).populate('user orderItems.product');
        res.status(200).json({
            success: true,
            data: orders
        });
    } catch(error){
        return next(new ErrorHandler(error.message,error.statusCode))
    }
}

exports.orders = async (req,res,next) =>{
    try {
        const orders = await Order.find().populate('user orderItems.product');
        let totalAmount = 0;
        orders.forEach(order => {
            totalAmount += order.totalPrice;
        });
        res.status(200).json({
            success: true,
            totalAmount,
            data: orders
        });

    }catch(error){
        return next(new ErrorHandler(error.message,error.statusCode))
    }
}