const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Error: ${error.message}`);
    console.error("Make sure MongoDB is installed and running locally, or update MONGO_URI in server/.env.");
    process.exit(1);
  }
};

module.exports = connectDB;