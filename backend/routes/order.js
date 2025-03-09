const express = require('express');
const {isAuthenticatedUser,authorizedRoles} = require('../middlewares/AuthMiddleware');
const OrderController = require('../controllers/OrderController')
const Router = express.Router();

Router.route('/new-order').post(isAuthenticatedUser,OrderController.newOrder);
Router.route('/order/detail/:id').get(isAuthenticatedUser,OrderController.orderById);
Router.route('/user/orders').get(isAuthenticatedUser,OrderController.getUserOrders);
Router.route('/admin/orders').get(isAuthenticatedUser,authorizedRoles('admin'),OrderController.orders);

module.exports = Router;
