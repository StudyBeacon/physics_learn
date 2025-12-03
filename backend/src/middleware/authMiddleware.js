import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const auth = async (req, res, next) => {
const token = req.headers.authorization?.split(' ')[1];
if (!token) return res.status(401).json({ message: 'No token provided' });
try {
const decoded = jwt.verify(token, process.env.JWT_SECRET);
req.user = await User.findById(decoded.id).select('-password');
next();
} catch (err) {
res.status(401).json({ message: 'Invalid token' });
}
};

export default auth;

export const requireRole = (roles = []) => {
  const allowed = Array.isArray(roles) ? roles : [roles];
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    if (allowed.length && !allowed.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
};