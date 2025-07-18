import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

  if (!DB_HOST || !DB_USER || !DB_NAME) {
    console.error('❌ Missing required MySQL environment variables.');
    process.exit(1);
  }

  try {
    // Connect without selecting DB first
    const connection = await mysql.createConnection({
      host: DB_HOST,
      port: Number(DB_PORT) || 3306,
      user: DB_USER,
      password: DB_PASSWORD || '',
    });

    // Create DB if not exists
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
    await connection.end();

    // Now connect with DB selected
    const dbConnection = await mysql.createConnection({
      host: DB_HOST,
      port: Number(DB_PORT) || 3306,
      user: DB_USER,
      password: DB_PASSWORD || '',
      database: DB_NAME,
    });

    console.log(`✅ MySQL connected: ${DB_HOST}/${DB_NAME}`);
    const db = drizzle(dbConnection);
    return db;
  } catch (err) {
    console.error('❌ MySQL connection failed:', err);
    process.exit(1);
  }
};

export default connectDB;
