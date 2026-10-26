import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { connectDB } from '../config/db.js';
import { Visitor } from '../models/Visitor.js';
import { Contact } from '../models/Contact.js';
import { Booking } from '../models/Booking.js';

const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../data');

async function sync() {
  await connectDB();

  const visitors = JSON.parse(await fs.readFile(path.join(dir, 'visitors.json'), 'utf8').catch(() => '[]'));
  const messages = JSON.parse(await fs.readFile(path.join(dir, 'messages.json'), 'utf8').catch(() => '[]'));
  const bookings = JSON.parse(await fs.readFile(path.join(dir, 'bookings.json'), 'utf8').catch(() => '[]'));

  console.log(`Syncing ${visitors.length} visitors, ${messages.length} messages, ${bookings.length} bookings to MongoDB Atlas...`);

  for (const v of visitors) {
    await Visitor.updateOne({ email: v.email, at: v.at }, { $set: v }, { upsert: true });
  }
  for (const m of messages) {
    await Contact.updateOne({ email: m.email, createdAt: m.createdAt }, { $set: m }, { upsert: true });
  }
  for (const b of bookings) {
    await Booking.updateOne({ email: b.email, date: b.date, time: b.time }, { $set: b }, { upsert: true });
  }

  const vCount = await Visitor.countDocuments();
  const mCount = await Contact.countDocuments();
  const bCount = await Booking.countDocuments();
  console.log('MongoDB Atlas Synced Counts:', { visitors: vCount, messages: mCount, bookings: bCount });
  process.exit(0);
}

sync().catch((err) => {
  console.error('Sync failed:', err);
  process.exit(1);
});
