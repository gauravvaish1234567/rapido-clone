const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function protect(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const tokenFromHeader = authHeader?.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : authHeader;
    const token = tokenFromHeader || req.headers['x-access-token'];

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: missing auth token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-passwordHash');

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: token user not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized: invalid or expired token' });
  }
}

module.exports = { protect };
