import mongoose from "mongoose";

const DATABASE_URL = "mongodb://localhost:27017/social-network-db";

const connectDb = () => {
  return mongoose.connect(DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });
};
connectDb().then(async () => {
  console.log(`CONNECTED`);
});
