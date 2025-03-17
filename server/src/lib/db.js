import mongoose from "mongoose"
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async()=>{
    try {
        console.log("🔍 MONGO_URI:", process.env.MONGODB_URI);

    //    const conn =  await mongoose.connect(process.env.MONGODB_URI);
    //    console.log(`MongoDB Connected : ${conn.connection.host}`)
    } catch (error) {
        console.log("MongoDB Connection Error: ", error)
        process.exit(1)
    }
}