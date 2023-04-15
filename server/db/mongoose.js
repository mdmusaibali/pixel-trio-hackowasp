import mongoose from "mongoose";

const Init = async () => {
  await mongoose.connect(process.env.MONGO_URL);
  console.log("Connected to db");
};

Init();
