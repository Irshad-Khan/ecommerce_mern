const express = require('express');
const router = express.Router();

const ProductController = require('../controllers/ProductController');

router.route('/products').get(ProductController.index);
router.route('/admin/product/store').post(ProductController.store);
router.route('/product/detail/:id').get(ProductController.show);
router.route('/admin/product/delete/:id').delete(ProductController.delete);
router.route('/admin/product/update/:id').put(ProductController.update);

module.exports = router;