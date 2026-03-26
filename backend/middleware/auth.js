const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey123';

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token || token === 'null' || token === 'undefined') {
        return res.status(401).json({ message: 'Access Denied: No token provided' });
    }

    try {
        const verified = jwt.verify(token, JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        // Return 401 (not 400) so the frontend can detect auth failures consistently
        res.status(401).json({ message: 'Invalid or expired token. Please log in again.' });
    }
};

const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user && req.user.isAdmin) {
            next();
        } else {
            res.status(403).json({ message: 'Admin Access Required' });
        }
    });
};

module.exports = { verifyToken, verifyAdmin };
