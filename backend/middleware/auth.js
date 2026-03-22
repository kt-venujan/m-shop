const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token || token === 'null') return res.status(401).json({ message: 'Access Denied' });

    try {
        const verified = jwt.verify(token, 'supersecretkey123');
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid Token' });
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
