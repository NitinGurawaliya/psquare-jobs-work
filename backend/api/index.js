// Vercel serverless function entry point
require('dotenv').config();

const app = require('../src/app');
const { connectDB } = require('../src/config/db');

// Cache database connection for serverless
let isConnected = false;

async function ensureDBConnection() {
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
    } catch (error) {
      console.error('DB connection error:', error);
      isConnected = false;
      throw error;
    }
  }
}

// Initialize DB connection before handling requests
module.exports = async (req, res) => {
  try {
    await ensureDBConnection();
    return app(req, res);
  } catch (error) {
    console.error('Request error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

