import jwt from 'jsonwebtoken';
import User from '../models/User.js';
const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
const publicUser = (u) => ({ id: u._id, name: u.name, email: u.email, avatar: u.avatar, role: u.role });
export const register = async (req, res) => { try { const { name, email, password } = req.body; if (!name || !email || !password) return res.status(400).json({ message: 'All fields are required' }); if (await User.findOne({ email })) return res.status(409).json({ message: 'Email already registered' }); const first = (await User.countDocuments()) === 0; const user = await User.create({ name, email, password, role: first ? 'admin' : 'user' }); res.status(201).json({ user: publicUser(user), token: signToken(user._id) }); } catch (error) { res.status(500).json({ message: error.message }); } };
export const login = async (req, res) => { try { const { email, password } = req.body; const user = await User.findOne({ email }); if (!user || !(await user.matchPassword(password))) return res.status(401).json({ message: 'Invalid email or password' }); res.json({ user: publicUser(user), token: signToken(user._id) }); } catch (error) { res.status(500).json({ message: error.message }); } };
export const me = async (req, res) => res.json({ user: publicUser(req.user) });
