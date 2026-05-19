const AuditLog = require('../models/AuditLog');

/**
 * Middleware that auto-logs mutations (POST/PUT/PATCH/DELETE)
 * Attach after auth middleware so req.user is available
 */
const auditMiddleware = (req, res, next) => {
    // Only intercept mutation requests
    if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
        return next();
    }

    // Store the original json method
    const originalJson = res.json.bind(res);

    res.json = function (body) {
        // Only log successful mutations
        if (res.statusCode >= 200 && res.statusCode < 300) {
            const actionMap = {
                'POST': 'CREATE',
                'PUT': 'UPDATE',
                'PATCH': 'UPDATE',
                'DELETE': 'DELETE'
            };

            const logData = {
                userId: req.user?._id || req.user?.id,
                userName: req.user?.name || req.user?.username || 'System',
                action: actionMap[req.method] || 'UNKNOWN',
                entity: req.baseUrl.split('/').pop() || 'Unknown',
                ipAddress: req.ip || req.connection?.remoteAddress,
                details: `${req.method} ${req.originalUrl}`
            };

            // Try to extract target ID from params or response body
            if (req.params?.id) {
                logData.entityId = req.params.id;
            } else if (body?._id || body?.id) {
                logData.entityId = body._id || body.id;
            }

            // Create the audit log asynchronously
            if (logData.userId) {
                AuditLog.create(logData).catch(err => {
                    console.error('Audit log creation failed:', err.message);
                });
            }
        }

        return originalJson(body);
    };

    next();
};

module.exports = {
    auditMiddleware
};
