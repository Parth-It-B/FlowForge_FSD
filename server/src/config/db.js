import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/flowforge';

  try {
    // Attempt connecting to the configured MongoDB instance
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 2500 });
    console.log(`[MongoDB] Connected to database at: ${uri}`);
  } catch (error) {
    console.warn(`[MongoDB] Could not connect to ${uri}. Initializing in-memory MongoDB for local evaluation...`);
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const memoryUri = mongod.getUri();
      await mongoose.connect(memoryUri);
      console.log(`[MongoDB] Connected to in-memory instance: ${memoryUri}`);
    } catch (memError) {
      console.error('[MongoDB] Failed to start fallback database:', memError.message);
      process.exit(1);
    }
  }
};
