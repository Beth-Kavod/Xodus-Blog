import { createConnection } from "mongoose";
const { MONGO_URL_USERS } = process.env


const useUserDB = () => {
  try {
    if (!MONGO_URL_USERS) throw new Error("No connection string for Users")
    return createConnection(MONGO_URL_USERS);
  } catch (error) {
    console.log(error)
  }
} 

export default useUserDB
