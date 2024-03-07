const mongoose = require("mongoose");
import dotenv from 'dotenv'
dotenv.config()

const uri = process.env.mongodbURI; // Replace with your MongoDB URI
const dbName = 'Blog'; // Replace with your database name

let cachedConnection = null;

export async function connectToDatabase() {
  if (cachedConnection) {
    return cachedConnection;
  }

  const connection = await mongoose.connect(`${uri}/${dbName}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  cachedConnection = connection;
  return connection;
}

export function disconnectFromDatabase() {
  if (!cachedConnection) {
    return;
  }

  mongoose.disconnect();
}