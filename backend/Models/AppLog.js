const mongoose = require('mongoose');

const appLog = new mongoose.Schema({
    url:{
        type: String,
    },
    endpoint: {
        type: String,
    },
    method: {
        type: String,
    },
    ip:{
        type: String,
    },
    status_code: {
        type: Number,
    },
    request_body:{
        type: String,
    },
    response:{
        type: String,
    },
    request_headers:{
        type: Object,
    },
    created_at:{
        type: Date,
        default: Date.now
    },
    updated_at:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('AppLog',appLog);