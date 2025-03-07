// const mongoose = require('mongoose');

// const dbName = process.env.DB_NAME

// const dbCotainer = 'mongodb'
// // Test editing
// // MongoDB connection URI
// const mongoURI = `mongodb://${dbCotainer}:27017`;
// // const mongoURI =  `mongodb://localhost:27017/` use this line for npm run generate for books courses and users
// async function dbConnect() {
//     mongoose.connection.on('connected', () => {
//         console.log("Connected: ", dbName)
//     })
//     // Connect to MongoDB
//     await mongoose.connect(mongoURI, {
//         dbName: dbName
//     })
// }

// module.exports = dbConnect

const mongoose = require('mongoose');

const dbName = process.env.DB_NAME;
const dbContainer = 'mongodb';

const username = "admin";
const password = "PwdKeyforMongo"; // Replace with the actual password

const authSource = "admin"; // Authentication database (typically 'admin')
// const port="27017"

// MongoDB connection URI
// const mongoURI = `mongodb://${dbContainer}:27017`;
// const mongoURI = `mongodb://localhost:27017/` use this line for npm run generate for books courses and users
// const mongoURI = `mongodb://${username}:${password}@89.117.146.214:27017/?authSource=${authSource}`;
// const mongoURI = `mongodb://admin:PwdKeyforMongo@89.117.146.214:27017/database?authSource=admin`;
const mongoURI = `mongodb://admin:PwdKeyforMongo@mongodb:27017/?authSource=admin`;


async function dbConnect() {
  mongoose.connection.on('connected', () => {
    console.log('MongoDB connected:', dbName);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected. Retrying...');
    setTimeout(() => dbConnect(), 5000); // Retry connection after 5 seconds
  });

  mongoose.connection.on('reconnected', () => {
    console.log('MongoDB reconnected:', dbName);
  });

  mongoose.connection.on('error', (error) => {
    console.error('MongoDB connection error:', error);
  });

  try {
    await mongoose.connect(mongoURI, { dbName });
    console.log('Initial connection successful');
  } catch (error) {
    console.error('Initial connection failed. Retrying in 5 seconds...', error);
    setTimeout(() => dbConnect(), 5000); // Retry connection after 5 seconds
  }
}

module.exports = dbConnect;
