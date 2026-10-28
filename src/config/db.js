import mongoose from 'mongoose';
import { env } from './env.js';

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

let lastDBError = null;

export async function connectDB() {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return true;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(env.mongodbUri, {
        serverSelectionTimeoutMS: 3000,
        bufferCommands: false,
      })
      .then((m) => {
        lastDBError = null;
        console.log(`[Database] MongoDB Atlas Connected: ${m.connection.host}`);
        return m;
      })
      .catch((err) => {
        cached.promise = null;
        lastDBError = err.message;
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

export function getDBError() {
  return lastDBError;
}

export function getMaskedMongoUri() {
  try {
    return env.mongodbUri ? env.mongodbUri.replace(/:([^:@]+)@/, ':****@') : 'not set';
  } catch {
    return 'error';
  }
}
