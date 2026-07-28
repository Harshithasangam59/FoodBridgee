import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDb } from '../config/database.js';

const JWT_SECRET = process.env.JWT_SECRET || 'foodbridge_jwt_secret_key_2026';

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });
};

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields (name, email, password, role)' });
    }

    if (!['donor', 'ngo'].includes(role.toLowerCase())) {
      return res.status(400).json({ success: false, message: 'Role must be either "donor" or "ngo"' });
    }

    const db = await getDb();
    const existingUser = await db.get('SELECT id FROM users WHERE email = ?', [email.toLowerCase().trim()]);

    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const result = await db.run(
      `INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)`,
      [name.trim(), email.toLowerCase().trim(), password_hash, role.toLowerCase()]
    );

    const newUser = {
      id: result.lastID,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      role: role.toLowerCase()
    };

    const token = generateToken(newUser.id);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: newUser
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ success: false, message: 'Server error during registration' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const db = await getDb();
    const user = await db.get('SELECT * FROM users WHERE email = ?', [email.toLowerCase().trim()]);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const userPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    };

    const token = generateToken(user.id);

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: userPayload
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

export const getMe = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: req.user
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error retrieving user' });
  }
};
