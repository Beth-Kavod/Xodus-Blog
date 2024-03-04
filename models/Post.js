const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const postDB = require('@/connections/postDB')

let postSchema = new Schema({
    author: {
      type: String
    }, 
    title: {
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
    imageUrl: {
      type: String
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