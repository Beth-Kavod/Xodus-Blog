import bcrypt from "bcryptjs"

/* ----------------------------- MongoDB Schemas ---------------------------- */

import Post from '@/models/Post'
import Comment from '@/models/Comment'
import User from '@/models/User'

/* ------------------------------- Count votes ------------------------------ */

function countVotes(data) {
  let trueVotes = 0;
  let falseVotes = 0;

  for (const item of data) {
    if (item.vote === true) {
      trueVotes++;
    } else if (item.vote === false) {
      falseVotes++;
    }
  }

  return trueVotes - falseVotes;
}

/* ----------------------- Hash strings with bcryptjs ----------------------- */

async function hash(input) {
  const salt = await bcrypt.genSalt(10)

  // Hash the input using the generated salt
  const hashedOutput = await bcrypt.hash(input, salt)

  return hashedOutput
}

/* ------------------- Generate users id for verification ------------------- */

function generateUserAuthID() {
  const getRandomChar = () => {
    const characters = '0123456789ABCDEF'
    const randomIndex = Math.floor(Math.random() * characters.length)
    return characters[randomIndex]
  }

  const generateBlock = () => {
    let block = ''
    for (let i = 0; i < 6; i++) {
      block += getRandomChar()
    }
    return block
  }

  return `${generateBlock()}-${generateBlock()}-${generateBlock()}-${generateBlock()}-${generateBlock()}-${generateBlock()}`
}

/* ------------------------ check for duplicate vote ------------------------ */

async function isDuplicate(request, id, author) {
  let updatedDoc
  let { vote } = await request.json()

  let newVote = { author, vote }

  const existingVoteInPost = await Post.findOne(
    { 
      _id: id, 
      "votes.author": author 
    }
  )

  const existingVoteInComment = await Comment.findOne(
    { 
      _id: id, 
      "votes.author": author 
    }
  )

  if (existingVoteInPost) {      
    updatedDoc = await Post.findOneAndUpdate(
      { _id: id, "votes.author": author },
      {
        $set: {
          'votes.$': newVote
        },
      },
      {
        new: true,
      }
    );
    updatedDoc.voteCount = countVotes(updatedDoc.votes);
    await updatedDoc.save()
  } else if (existingVoteInComment) {
    updatedDoc = await Comment.findOneAndUpdate(
      { _id: id, "votes.author": author },
      {
        $set: {
          'votes.$': newVote
        },
      },
      {
        new: true,
      }
    );
    updatedDoc.voteCount = countVotes(updatedDoc.votes);
    await updatedDoc.save()
  }

  const existingVote = existingVoteInPost || existingVoteInComment

  if (existingVote) {
    return true
  } else {
    return false
  }
}

/* -------------------------- Check if doc exists -------------------------- */

async function isValid_id(id, schema) {
  const doc = await schema.findById(id);
  if (!doc) throw new Error;
}

/* ---------------------- Get a users auth with authID ---------------------- */

async function getUserWithID(userID) {
  const user = await User.findOne({ userAuthID: userID })
  if (!user) return false
  return user
}

/* -------------------------------------------------------------------------- */

module.exports = { countVotes, isValid_id, isDuplicate, getUserWithID, generateUserAuthID, hash }