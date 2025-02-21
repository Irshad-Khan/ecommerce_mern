const express = require('express');
const Router = express.Router();

const AuthController = require('../controllers/Auth/AuthController');

Router.route('/register').post(AuthController.registerUser);
Router.route('/login').post(AuthController.login);

module.exports = Router;