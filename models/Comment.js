const mongoose = require("mongoose")
import blogDB from '@/connections/blogDB'
import { countVotes } from '@/utils/routeMethods'
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