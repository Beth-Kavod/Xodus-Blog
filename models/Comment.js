const mongoose = require("mongoose")
import blogDB from '@/connections/blogDB'
import userDB from '@/connections/userDB'
import { countVotes } from '@/utils/routeMethods'
const Schema = mongoose.Schema;

let commentSchema = new Schema({
    author: {
      username: {
        type: String,
        required: true
      },
      id: {
        type: Schema.Types.ObjectId,
        // This cant reference a user that is outside the collection
        // ref: 'User',
        required: true
      },
    }, 
    content: {
      type: String,
      required: true
    },
    votes: {
      type: [{
        date: Date,
        user: Schema.Types.ObjectId,
        vote: Boolean
      }],
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

commentSchema.pre('save', function(next) {
  const votes = this.votes || []
  const countedVotes = countVotes(votes)
  this.voteCount = countedVotes
  next()
});

const Comment = blogDB.model('Comment', commentSchema)

blogDB.once('open', () => {
  console.log('Connected to blogDB for Comments')
})

module.exports = Comment