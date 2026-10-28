import mongoose from 'mongoose';
import { env } from './env.js';

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return true;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(env.mongodbUri, {
        serverSelectionTimeoutMS: 2500,
        bufferCommands: false,
      })
      .then((m) => {
        console.log(`[Database] MongoDB Atlas Connected: ${m.connection.host}`);
        return m;
      })
      .catch((err) => {
        cached.promise = null;
        console.warn(`[Database] MongoDB not reachable (${err.message}). Falling back to local storage.`);
        return null;
      });
  }

  cached.conn = await cached.promise;
  return isDBConnected();
}

export function isDBConnected() {
  return mongoose.connection.readyState === 1;
}
