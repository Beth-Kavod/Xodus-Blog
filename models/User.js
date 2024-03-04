const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userDB = require('@/connections/userDB')

let userSchema = new Schema({
    username: {
      type: String,
      required: true
    },
    userAuthID: {
      type: String
    },
    email: {
      type: String
    },
    admin: {
      type: Boolean
    },
    avatar: {
      type: String
    },
    tags: {
      type: Array
    }
},{
    collection: 'users',
    timestamps: true
})

const User = userDB.model('User', userSchema)

userDB.once('open', () => {
  console.log('Connected to userDB for Users')
})

module.exports = User
