import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { env } from '../config/env.js';
import { isDBConnected } from '../config/db.js';
import { Admin } from '../models/Admin.js';

const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../data');
const adminFile = path.join(dir, 'admin.json');

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    let adminRecord = null;

    // 1. Check MongoDB
    if (isDBConnected()) {
      const doc = await Admin.findOne({ email: email.toLowerCase().trim() });
      if (doc) {
        adminRecord = { email: doc.email, password: doc.password, role: doc.role };
      }
    }

    // 2. Check JSON file backup
    if (!adminRecord) {
      try {
        const fileData = JSON.parse(await fs.readFile(adminFile, 'utf8'));
        if (fileData && fileData.email.toLowerCase() === email.toLowerCase().trim()) {
          adminRecord = fileData;
        }
      } catch {
        // file doesn't exist
      }
    }

    // 3. Fallback to env credentials
    if (!adminRecord && email.toLowerCase().trim() === env.admin.email.toLowerCase()) {
      if (password === env.admin.password) {
        const token = jwt.sign(
          { email: env.admin.email, role: 'admin' },
          env.jwtSecret,
          { expiresIn: '7d' }
        );
        return res.json({ token, email: env.admin.email, role: 'admin' });
      }
    }

    if (!adminRecord) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, adminRecord.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { email: adminRecord.email, role: adminRecord.role || 'admin' },
      env.jwtSecret,
      { expiresIn: '7d' }
    );

    res.json({ token, email: adminRecord.email, role: adminRecord.role || 'admin' });
  } catch (err) {
    next(err);
  }
}

export function getMe(req, res) {
  res.json({ email: req.admin.email, role: req.admin.role });
}
