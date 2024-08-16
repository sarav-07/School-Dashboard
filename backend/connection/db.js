import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL).then(() => {
      console.log("Database connected successfully");
    });
  } catch (err) {
    console.error(err.message);
  }
};

