import mongoose, { Connection } from "mongoose";
import { connectToUserDatabase } from "@/connections/userDB";

const Schema = mongoose.Schema;

// Connect to user database
var userDBConnection: Connection | null = null;
(async () => {
    userDBConnection = await connectToUserDatabase();
    if (!userDBConnection) {
        console.error("Failed to connect to user database. Exiting...");
        process.exit(1);
    }
})();

let userSchema = new Schema({
    username: {
      type: String,
      required: true
    },
    userAuthId: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    admin: {
      type: Boolean,
      required: true
    },
    avatar: {
      type: String,
      required: false
    },
    tags: {
      type: Array,
      required: false
    }
},{
    collection: 'users',
    timestamps: true
});

if (!userDBConnection) {
    console.error("No connection to user database. Exiting...");
    process.exit(1);
}

const User = userDBConnection.model('User', userSchema);

userDBConnection.once('open', () => {
  console.log('Connected to userDB for Users');
});

export default User;
