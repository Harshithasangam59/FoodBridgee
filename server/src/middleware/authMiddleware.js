import jwt from 'jsonwebtoken';
import { getDb } from '../config/database.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const secret = process.env.JWT_SECRET || 'foodbridge_jwt_secret_key_2026';
      const decoded = jwt.verify(token, secret);

      const db = await getDb();
      const user = await db.get(
        'SELECT id, name, email, role, createdAt FROM users WHERE id = ?',
        [decoded.id]
      );

      if (!user) {
        return res.status(401).json({ success: false, message: 'User not found or token invalid' });
      }

      req.user = user;
      return next();
    } catch (error) {
      console.error('JWT Error:', error.message);
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user ? req.user.role : 'none'}' is not authorized to access this route`,
      });
    }
    next();
  };
};
