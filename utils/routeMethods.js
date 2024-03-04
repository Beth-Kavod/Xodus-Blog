/* ----------------------------- MongoDB Schemas ---------------------------- */

// const voteSchema = require('../models/Vote')
const postSchema = require('../models/Post')
const commentSchema = require('../models/Comment')
const userSchema = require('../models/User')

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

/* ------------------------ check for duplicate vote ------------------------ */

async function isDuplicate(req, id, author) {
  let updatedDoc
  let { vote } = req.body

  let newVote = { author, vote }

  const existingVoteInPost = await postSchema.findOne(
    { 
      _id: id, 
      "votes.author": author 
    }
  )

  const existingVoteInComment = await commentSchema.findOne(
    { 
      _id: id, 
      "votes.author": author 
    }
  )

  if (existingVoteInPost) {      
    updatedDoc = await postSchema.findOneAndUpdate(
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
    updatedDoc = await commentSchema.findOneAndUpdate(
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
  return true;
}

/* ---------------------- Get a users auth with authID ---------------------- */

async function getUserWithID(userID) {
  const user = await userSchema.findOne({ userAuthID: userID })
  if (!user) return false
  return user
}

/* -------------------------------------------------------------------------- */

module.exports = { countVotes, isValid_id, isDuplicate, getUserWithID }