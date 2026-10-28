import { promises as fs } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { isDBConnected } from '../config/db.js';
import { Contact } from '../models/Contact.js';
import { Visitor } from '../models/Visitor.js';
import { Booking } from '../models/Booking.js';

// In serverless environments (e.g. Vercel), /var/task is read-only.
// We use os.tmpdir() for writable fallback storage.
const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const dir = isServerless
  ? path.join(os.tmpdir(), 'portfolio-data')
  : path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../data');

const messagesFile = path.join(dir, 'messages.json');
const visitorsFile = path.join(dir, 'visitors.json');
const bookingsFile = path.join(dir, 'bookings.json');

async function readJSON(filePath) {
  try {
    return JSON.parse(await fs.readFile(filePath, 'utf8'));
  } catch {
    return [];
  }
}

async function writeJSON(filePath, data) {
  try {
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.warn(`[Storage] Local fallback write skipped (${path.basename(filePath)}): ${err.message}`);
  }
}

/* ==================== CONTACT MESSAGES ==================== */
export async function saveMessage(message) {
  let savedId = Date.now().toString();

  if (isDBConnected()) {
    try {
      const doc = await Contact.create(message);
      savedId = doc._id.toString();
    } catch (err) {
      console.error('[DB] Contact.create error:', err.message);
    }
  }

  // Backup in messages.json
  const list = await readJSON(messagesFile);
  const record = {
    id: savedId,
    ...message,
    replied: false,
    replies: [],
    createdAt: new Date().toISOString(),
  };
  list.unshift(record);
  await writeJSON(messagesFile, list);
  return record;
}

export async function getMessages() {
  if (isDBConnected()) {
    try {
      const docs = await Contact.find().sort({ createdAt: -1 });
      return docs.map((d) => ({
        id: d._id.toString(),
        name: d.name,
        email: d.email,
        message: d.message,
        replied: d.replied,
        replies: d.replies || [],
        createdAt: d.createdAt,
      }));
    } catch (err) {
      console.error('[DB] Contact.find error:', err.message);
    }
  }
  return readJSON(messagesFile);
}

export async function addMessageReply(messageId, { subject, message }) {
  if (isDBConnected()) {
    try {
      await Contact.findByIdAndUpdate(messageId, {
        replied: true,
        $push: { replies: { subject, message, sentAt: new Date() } },
      });
    } catch (err) {
      console.error('[DB] Contact reply error:', err.message);
    }
  }

  const list = await readJSON(messagesFile);
  const item = list.find((m) => m.id === messageId || m._id === messageId);
  if (item) {
    item.replied = true;
    item.replies = item.replies || [];
    item.replies.push({ subject, message, sentAt: new Date().toISOString() });
    await writeJSON(messagesFile, list);
  }
  return true;
}

/* ==================== VISITORS (HANDSHAKE) ==================== */
export async function saveVisitor(visitor) {
  let savedId = Date.now().toString();

  if (isDBConnected()) {
    try {
      const doc = await Visitor.create(visitor);
      savedId = doc._id.toString();
    } catch (err) {
      console.error('[DB] Visitor.create error:', err.message);
    }
  }

  const list = await readJSON(visitorsFile);
  const record = {
    id: savedId,
    ...visitor,
    createdAt: visitor.at || new Date().toISOString(),
  };
  list.unshift(record);
  await writeJSON(visitorsFile, list);
  return record;
}

export async function getVisitors() {
  if (isDBConnected()) {
    try {
      const docs = await Visitor.find().sort({ createdAt: -1 });
      return docs.map((d) => ({
        id: d._id.toString(),
        name: d.name,
        email: d.email,
        referrer: d.referrer,
        welcomeEmailSent: d.welcomeEmailSent,
        createdAt: d.createdAt,
      }));
    } catch (err) {
      console.error('[DB] Visitor.find error:', err.message);
    }
  }
  return readJSON(visitorsFile);
}

/* ==================== BOOKINGS (1:1 CALLS) ==================== */
export async function saveBooking(booking) {
  let savedId = Date.now().toString();

  if (isDBConnected()) {
    try {
      const doc = await Booking.create(booking);
      savedId = doc._id.toString();
    } catch (err) {
      console.error('[DB] Booking.create error:', err.message);
    }
  }

  const list = await readJSON(bookingsFile);
  const record = {
    id: savedId,
    ...booking,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  };
  list.unshift(record);
  await writeJSON(bookingsFile, list);
  return record;
}

export async function getBookings() {
  if (isDBConnected()) {
    try {
      const docs = await Booking.find().sort({ createdAt: -1 });
      return docs.map((d) => ({
        id: d._id.toString(),
        name: d.name,
        email: d.email,
        date: d.date,
        time: d.time,
        notes: d.notes,
        status: d.status,
        createdAt: d.createdAt,
      }));
    } catch (err) {
      console.error('[DB] Booking.find error:', err.message);
    }
  }
  return readJSON(bookingsFile);
}

/* ==================== AGGREGATED STATS ==================== */
export async function getStats() {
  const [visitors, messages, bookings] = await Promise.all([
    getVisitors(),
    getMessages(),
    getBookings(),
  ]);

  return {
    totalVisitors: visitors.length,
    totalMessages: messages.length,
    totalBookings: bookings.length,
    pendingReplies: messages.filter((m) => !m.replied).length,
  };
}
