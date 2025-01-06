const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_hardcoded_jwt_secret_key';

const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Attach user details to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error('Token verification failed:', error);
        res.status(403).json({ error: 'Invalid token' });
    }
};
const roleCheck = (role) => (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized: No token provided' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.role !== role) {
            return res.status(403).json({ error: 'Forbidden: You do not have the correct role' });
        }
        next(); // User has the correct role
    } catch (error) {
        console.error('Role verification failed:', error);
        res.status(403).json({ error: 'Invalid token' });
    }
};


module.exports = { authenticateUser, roleCheck };
