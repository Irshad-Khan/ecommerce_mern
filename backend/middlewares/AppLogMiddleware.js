const AppLog = require('../Models/AppLog');

const logMiddleware = (req, res, next) => {
    // Store original response method
    const oldJson = res.json;
    res.json = function (data) {
        // Log entry
        const appLog = new AppLog({
            url: req.originalUrl,
            endpoint: req.route ? req.route.path : req.originalUrl, // Handle undefined routes
            method: req.method,
            ip: req.ip,
            status_code: res.statusCode,
            request_body: JSON.stringify(req.body),
            response: JSON.stringify(data), // Capture response
            request_headers: JSON.stringify(req.headers),
            action: req.action,
            controller: req.controller
        });

        // Save log without affecting response flow
        appLog.save().catch(err => console.error('Logging error:', err));

        // Continue with the original response
        oldJson.call(this, data);
    };

    next();
};

module.exports = logMiddleware;
