import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

dotenv.config(); 

const connectDB = async () => {
  try {
    console.log(process.env.MONGODB_URL);
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Database Connected");
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
