import mongoose from 'mongoose';

export const connectMongoDB = async() => {
  try {
    const mongoUrl = process.env.MONGO_URL;
    if (!mongoUrl)
        throw new Error('MONGO_URL environment variable is required');

    await mongoose.connect(mongoUrl);
    console.log('MongoDB connection established successfully');
  } catch (error) {
    console.log('Failed to connect to MongoDB:', error.message);
    process.exit(1);
  }
};
