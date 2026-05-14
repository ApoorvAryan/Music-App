console.log("DB LOADING...");
import mongoose from 'mongoose';
const connectDB = async () => {
  try { if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI missing in .env'); const conn = await mongoose.connect(process.env.MONGODB_URI); console.log(`MongoDB connected: ${conn.connection.host}`); }
  catch (error) { console.error(`MongoDB connection failed: ${error.message}`); process.exit(1); }
};
export default connectDB;
