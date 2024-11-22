import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string, {});
        console.log('Database connected successfully')
    } catch (err) {
        console.log(err);
    }
}
