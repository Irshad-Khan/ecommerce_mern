const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const ErrorMiddleware = require('./middlewares/ErrorsMiddleware');

app.use(express.json());
app.use(cookieParser());

// Routes
const products = require('./routes/product')
const auth = require('./routes/auth')
const order = require('./routes/order')
app.use('/api/v1', products);
app.use('/api/v1', auth);
app.use('/api/v1', order);

// Error handling middleware
app.use(ErrorMiddleware);

module.exports = app;