import mongoose from 'mongoose'
import commentDB from '@/connections/commentDB'
const Schema = mongoose.Schema;

let commentSchema = new Schema({
    author: {
      type: String
    }, 
    content: {
      type: String
    },
    votes: {
      type: Array
    },
    voteCount: {
      type: Number
    },
    date: {
      type: Date
    },
    postID: {
      type: String
    }
},{
    collection: 'comments',
    timestamps: true
})

const Comment = commentDB.model('Comment', commentSchema)

commentDB.once('open', () => {
  console.log('Connected to userDB for Users')
})


module.exports = Comment