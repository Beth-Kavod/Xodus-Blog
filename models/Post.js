const mongoose = require("mongoose")
import blogDB from '@/connections/blogDB'
import { countVotes } from '@/utils/routeMethods'
const Schema = mongoose.Schema;

let postSchema = new Schema({
    author: {
      username: {
        type: String,
        required: true
      },
      // This doesn't work because of storing wrong values in localStorage, change later
      /* id: {
        type: Schema.Types.ObjectId,
        // This cant reference a user that is outside the collection
        // ref: 'User',
        required: true
      }, */
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
      type: [{
        date: Date,
        user: Schema.Types.ObjectId,
        // This cant reference a user that is outside the collection
        // ref: 'User',
        vote: Boolean
      }],
      required: false
    },
    voteCount: {
      type: Number,
      required: false
    },
    tags: {
      type: [String],
    },
    addresses: {
      type: [{
        name: String,
        address: String
      }],
      required: false
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

postSchema.pre('save', function(next) {
  const votes = this.votes || []
  const countedVotes = countVotes(votes)
  this.voteCount = countedVotes
  next()
});

const Post = blogDB.model('Post', postSchema)

blogDB.once('open', () => {
  console.log('Connected to blogDB for Posts')
})

export default Post