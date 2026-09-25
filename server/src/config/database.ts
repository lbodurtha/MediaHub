import mongoose from 'mongoose';
import { config } from './env.js';

const MAX_RETRIES = 5;
const BASE_DELAY_MS = 1000;

export async function connectDatabase(): Promise<void> {
  mongoose.connection.on('connected', () => {
    console.log('MongoDB connected successfully');
  });

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
  });

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      await mongoose.connect(config.DATABASE_URI);
      return;
    } catch (err) {
      if (attempt === MAX_RETRIES) {
        console.error(
          `Failed to connect to MongoDB after ${MAX_RETRIES} attempts`,
        );
        throw err;
      }
      const delay = BASE_DELAY_MS * Math.pow(2, attempt - 1);
      console.log(
        `MongoDB connection attempt ${attempt} failed, retrying in ${delay}ms...`,
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}
