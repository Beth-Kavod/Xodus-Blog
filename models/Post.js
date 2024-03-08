const mongoose = require("mongoose")
import blogDB from '@/connections/blogDB'
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
    addresses: {
      type: [{
        name: String,
        address: String
      }],
      required: false
    },
    tags: {
      type: [String],
    },
    videoLinks: {
      type: [{
        name: String,
        link: String
      }],
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

const Post = blogDB.model('Post', postSchema)
/* 
postSchema.pre('save', () => {
  this.
}) */

blogDB.once('open', () => {
  console.log('Connected to blogDB for Posts')
})




module.exports = Post