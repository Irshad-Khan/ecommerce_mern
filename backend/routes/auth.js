const express = require('express');
const Router = express.Router();

const AuthController = require('../controllers/Auth/AuthController');
const {isAuthenticatedUser,authorizedRoles} = require('../middlewares/AuthMiddleware');

Router.route('/register').post(AuthController.registerUser);
Router.route('/login').post(AuthController.login);
Router.route('/logout').post(AuthController.logout);
Router.route('/password/forgot').post(AuthController.forgotPassword);
Router.route('/password/reset/:token').put(AuthController.resetPassword);
Router.route('/profile').get(isAuthenticatedUser,AuthController.profile);
Router.route('/password/update').put(isAuthenticatedUser,AuthController.updatePassword);
Router.route('/profile/update').put(isAuthenticatedUser,AuthController.updateProfile);
Router.route('/all-users').get(isAuthenticatedUser,authorizedRoles('admin'),AuthController.allUsers);
Router.route('/user-by-id/:id').get(isAuthenticatedUser,authorizedRoles('admin'),AuthController.userById);
Router.route('/delete-user/:id').delete(isAuthenticatedUser,authorizedRoles('admin'),AuthController.deleteUser);
Router.route('/update-user/:id').put(isAuthenticatedUser,authorizedRoles('admin'),AuthController.updateUser);
module.exports = Router;