import { createConnection } from "mongoose";
const { MONGO_URL_BLOG } = process.env

const useBlogDB = () => {
  try {
    if (!MONGO_URL_BLOG) throw new Error("No connection string for Blog")
    return createConnection(MONGO_URL_BLOG);
  } catch (error) {
    console.log(error)
  }
} 

export default useBlogDB
