const express = require('express');
const router = express.Router();

const ProductController = require('../controllers/ProductController');
const {isAuthenticatedUser,authorizedRoles} = require('../middlewares/AuthMiddleware');

router.route('/products').get(ProductController.index);
router.route('/product/detail/:id').get(ProductController.show);
router.route('/admin/product/store')
    .post(isAuthenticatedUser,authorizedRoles('admin'),ProductController.store);
router.route('/admin/product/delete/:id')
    .delete(isAuthenticatedUser,authorizedRoles('admin'),ProductController.delete);
router.route('/admin/product/update/:id')
    .put(isAuthenticatedUser,authorizedRoles('admin'),ProductController.update);


module.exports = router;