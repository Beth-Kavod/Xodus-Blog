const mongoose = require("mongoose")
import blogDB from '@/connections/blogDB'
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
      type: Schema.Types.ObjectId,
      required: true
    }
},{
    collection: 'comments',
    timestamps: true
})

const Comment = blogDB.model('Comment', commentSchema)

blogDB.once('open', () => {
  console.log('Connected to blogDB for Comments')
})


module.exports = Comment