import bcrypt from 'bcryptjs';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { env } from '../config/env.js';
import { connectDB, isDBConnected } from '../config/db.js';
import { Admin } from '../models/Admin.js';

const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../data');
const adminFile = path.join(dir, 'admin.json');

async function seed() {
  console.log('--- Starting Admin User Seeder ---');
  await connectDB();

  const email = env.admin.email;
  const password = env.admin.password;
  const hashedPassword = await bcrypt.hash(password, 10);

  // 1. If MongoDB is connected, seed in MongoDB
  if (isDBConnected()) {
    const existing = await Admin.findOne({ email });
    if (existing) {
      existing.password = hashedPassword;
      await existing.save();
      console.log(`[MongoDB] Admin user updated: ${email}`);
    } else {
      await Admin.create({
        email,
        password: hashedPassword,
        role: 'admin',
      });
      console.log(`[MongoDB] Admin user created: ${email}`);
    }
  }

  // 2. Also save in data/admin.json for seamless offline/local login
  await fs.mkdir(dir, { recursive: true });
  const adminData = {
    email,
    password: hashedPassword,
    role: 'admin',
    updatedAt: new Date().toISOString(),
  };
  await fs.writeFile(adminFile, JSON.stringify(adminData, null, 2));
  console.log(`[File Backup] Admin user stored in data/admin.json`);

  console.log('------------------------------------');
  console.log(` Admin Email:    ${email}`);
  console.log(` Admin Password: ${password}`);
  console.log('------------------------------------');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeder failed:', err);
  process.exit(1);
});
