import mongoose from 'mongoose';
import { env } from './env.js';

let isMongoConnected = false;

export async function connectDB() {
  if (mongoose.connection.readyState >= 1) {
    isMongoConnected = true;
    return true;
  }
  try {
    const conn = await mongoose.connect(env.mongodbUri, {
      serverSelectionTimeoutMS: 5000,
    });
    isMongoConnected = true;
    console.log(`[Database] MongoDB Atlas Connected: ${conn.connection.host}`);
    return true;
  } catch (err) {
    isMongoConnected = false;
    console.warn(`[Database] MongoDB not reachable (${err.message}). Falling back to local JSON storage.`);
    return false;
  }
}

export function isDBConnected() {
  return isMongoConnected && mongoose.connection.readyState === 1;
}
