import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const register = async (req, res) => {
const { name, email, password } = req.body;
try {
let user = await User.findOne({ email });
if (user) return res.status(400).json({ message: 'User already exists' });


const salt = await bcrypt.genSalt(10);
const hashed = await bcrypt.hash(password, salt);


user = new User({ name, email, password: hashed });
await user.save();


const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
} catch (err) {
console.error(err);
res.status(500).send('Server error');
}
};


export const login = async (req, res) => {
const { email, password } = req.body;
try {
const user = await User.findOne({ email });
if (!user) return res.status(400).json({ message: 'Invalid credentials' });


const isMatch = await bcrypt.compare(password, user.password);
if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });


const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
} catch (err) {
console.error(err);
res.status(500).send('Server error');
}
};

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    if (user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};