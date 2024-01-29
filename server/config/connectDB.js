import mongoose, { connect } from "mongoose";
import colors from "colors";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`Successfully connected to mongodb Database`.bgGreen.white);
  } catch (error) {
    console.log(`Error while connecting to mongodb ${error}`.bgRed.white);
  }
};

export default connectDB;
