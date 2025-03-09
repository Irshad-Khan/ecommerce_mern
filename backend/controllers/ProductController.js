const Product = require('../Models/Product');

const ErrorHandler = require('../exceptions/ExceptionHandler');
const CatchAsyncErrorMiddleware = require('../middlewares/CatchAsyncErrorMiddleware');
const ApiFeatures = require('../utils/ApiFeatures')

/**
 * Return All Products => /api/v1/products
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.index = async (req, res, next) => {
    try {
        const resultPerPage = 4;
        const productCount = await Product.countDocuments();
        const apiFeatures = new ApiFeatures(Product.find(), req.query)
            .search()
            .filter()
            .pagination(resultPerPage);

        const products = await apiFeatures.query;
        res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            total: products.length,
            productCount,
            data: products
        });
    } catch (error) { 
        return next(new ErrorHandler(error.message,error.statusCode))
    }
}
 
/**
 * Store New Product => /api/v1/admin/product/store 
 * in this function we used CatchAsyncErrorMiddleware it is global for async error
 * if we not use then alternative is to use try catch block
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.store = CatchAsyncErrorMiddleware(async (req, res, next) => {
    req.body.user = req.user.id // Foregin Key
    const product = await Product.create(req.body);
    res.status(201).json({
        success: true,
        message: "Product saved successfully",
        data: product
    });
})

/**
 * Return Product Detail => /api/v1/product/detail/:id
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.show = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product)
            return next(new ErrorHandler('Product not found',404))

        res.status(200).json({
            success: true,
            message: "Product detail fetched successfully",
            data: product
        });
    } catch (error) {
       return next(new ErrorHandler(error.message,error.statusCode))
    }
}

/**
 * Return Product Update => /api/v1/admin/product/update/:id
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.update = async (req, res, next) => {
    try {
        let product = await Product.findById(req.params.id);

        if (!product)
            return next(new ErrorHandler('Product not found',404))


        product = await Product.findByIdAndUpdate(req.params.id, req.body,
            {
                new: true,
                runValidators: true,
                useFindAndModify: false,
                
            });

        res.status(200).json({
            success: true,
            message: "Product Updated successfully",
            data: product
        });
    } catch (error) {
        return next(new ErrorHandler(error.message,error.statusCode))
    }
}

/**
 * Delete Product =>  /api/v1/admin/product/delete/:id
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
exports.delete = async (req, res, next) => { 
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product)
            return next(new ErrorHandler('Product not found',404))


        res.status(200).json({
            success: true,
            message: "Product deleted successfully",
            data: product
        });
        
    } catch (error) {
         return next(new ErrorHandler(error.message,error.statusCode))
    }
}

exports.createProductReview = async (req,res,next) => {
    try {
        const { rating, comments, productId    } = req.body;
        const review = {
            user: req.user._id,
            name: req.user.name,
            rating: Number(rating),
            comment: comments,
        };

        const product = await Product.findById(productId);
        if(!product) {
            return next(new ErrorHandler('Product not found',404))
        }
        const isReviewed = product.reviews.find(
            r => r.user.toString() === req.user._id.toString()
        )

        if (isReviewed) {

           product.reviews.forEach(review =>{
               if(review.user.toString() === req.user._id.toString()){
                   console.log('inside')
                   review.rating = Number(rating);
                   review.comment = comments;
               }
           })
        }else{
            product.reviews.push(review);
            product.numberOfReviews = product.reviews.length;
        }

        product.rating = product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length;
        await product.save({validateBeforeSave: false});
        res.status(201).json({
            success: true,
            message: "Review added successfully. Thanks for your feedback."
        });

    }catch (error) {
        return next(new ErrorHandler(error.message,error.statusCode))
    }
}

exports.getProductReviews = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return next(new ErrorHandler('Product not found', 404));
        }
        res.status(200).json({
            success: true,
            message: 'Product reviews fetched successfully',
            data: product.reviews
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, error.statusCode));
    }
}