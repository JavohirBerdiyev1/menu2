import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/restaurant';

let cached = global._mongoose;

if (!cached) {
  cached = global._mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        autoIndex: true,
        serverSelectionTimeoutMS: 5000,
      })
      .then((m) => {
        console.log('Successfully connected to MongoDB.');
        return m;
      })
      .catch((err) => {
        console.warn('MongoDB connection failed:', err.message);
        cached.promise = null; // reset to allow retry
        return null;
      });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}



