const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { signToken } = require('../utils/jwt');

async function signup(req, res) {
  const { name, phone, email, password, roles } = req.body;

  const exists = await User.findOne({ $or: [{ email }, { phone }] });
  if (exists) {
    return res.status(400).json({ message: 'User already exists with email or phone' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    phone,
    email,
    passwordHash,
    roles: Array.isArray(roles) && roles.length ? roles : ['rider'],
  });

  const token = signToken({ id: user._id });
  return res.status(201).json({ token, user: { ...user.toObject(), passwordHash: undefined } });
}

async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = signToken({ id: user._id });
  return res.json({ token, user: { ...user.toObject(), passwordHash: undefined } });
}

module.exports = { signup, login };
