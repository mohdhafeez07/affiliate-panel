import app from './app';
import dotenv from 'dotenv';
import prisma from './config/prisma';

dotenv.config();

const PORT = Number(process.env.PORT) || 5000;

async function startServer() {
  try {
    // Test Database Connection
    await prisma.$connect();
    console.log('Connected to PostgreSQL successfully!');

    app.listen(PORT, () => {
      console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
