const mongoose = require("mongoose")
import postDB from '@/connections/blogDB'
const Schema = mongoose.Schema;

let postSchema = new Schema({
    author: {
      type: String,
      required: true
    }, 
    title: {
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
    location: {
      type: String,
      required: false
    },
    imageUrls: {
      type: Array,
      required: false
    },
    comments: {
      type: [Schema.Types.ObjectId],
      ref: 'Comment',
      required: false
    }
},{
    collection: 'posts',
    timestamps: true
})

const Post = postDB.model('Post', postSchema)

postDB.once('open', () => {
  console.log('Connected to userDB for Users')
})


module.exports = Post