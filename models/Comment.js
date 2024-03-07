const mongoose = require("mongoose")
import commentDB from '@/connections/commentDB'
const Schema = mongoose.Schema;

let commentSchema = new Schema({
    author: {
      type: String,
      required: true
    }, 
    content: {
      type: String,
      required: true
    },
    votes: {
      type: Array,
      required: false
    },
    voteCount: {
      type: Number,
      required: false
    },
    date: {
      type: Date,
      required: true
    },
    postID: {
      type: String,
      required: true
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