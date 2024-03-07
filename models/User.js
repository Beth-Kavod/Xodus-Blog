import mongoose from "mongoose"
import userDB from '@/connections/userDB'
const Schema = mongoose.Schema;

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
})

const User = userDB.model('User', userSchema)

userDB.once('open', () => {
  console.log('Connected to userDB for Users')
})

module.exports = User
