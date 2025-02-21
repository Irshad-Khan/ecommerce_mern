const express = require('express');
const app = express();

const ErrorMiddleware = require('./middlewares/ErrorsMiddleware');

app.use(express.json());

// Routes
const products = require('./routes/product')
const auth = require('./routes/auth')
app.use('/api/v1', products);
app.use('/api/v1', auth);

// Error handling middleware
app.use(ErrorMiddleware);

module.exports = app;