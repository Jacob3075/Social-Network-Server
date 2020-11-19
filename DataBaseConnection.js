import mongoose from "mongoose";

const DATABASE_URL = "mongodb://localhost:27017/social-network-db";

export const connectToDatabase = () => {
  mongoose.connect(DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });
};

export const disconnectDatabase = () => {
  mongoose.connection.close();
};

