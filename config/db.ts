import mongoose from 'mongoose';
import env from "./env";
async function connectDB() {
    try {
        await mongoose.connect(`${env.mongoUrl}?authSource=admin`);
        console.log('🚀 Connected to MongoDB');
    } catch (error) {
        console.log('❌ MongoDB connection error: ', error);
    }
}

export default connectDB;