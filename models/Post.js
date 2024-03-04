const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const postDB = require('@/connections/postDB')

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
    imageUrl: {
      type: String,
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