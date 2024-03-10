import { createConnection, Connection } from "mongoose";

const { MONGO_URL_USERS } = process.env;

let userDBConnection: Connection | null = null;

const connectToUserDatabase = async (): Promise<Connection | null> => {
    try {
        if (!MONGO_URL_USERS) throw new Error("No connection string for Users");
        if (!userDBConnection) {
            userDBConnection = await createConnection(MONGO_URL_USERS);
            console.log("Connected to user database");
        }
        return userDBConnection;
    } catch (error) {
        console.error("Error connecting to user database:", error);
        return null;
    }
};

const disconnectFromUserDatabase = async (): Promise<void> => {
    try {
        if (userDBConnection) {
            await userDBConnection.close();
            console.log("Disconnected from user database");
            userDBConnection = null;
        }
    } catch (error) {
        console.error("Error disconnecting from user database:", error);
    }
};

export { connectToUserDatabase, disconnectFromUserDatabase };
