require('dotenv').config();

const app = require('./app');
const { connectDB } = require('./config/db');

const PORT = process.env.PORT || 4000;

async function start() {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is required');

  await connectDB();

  app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
