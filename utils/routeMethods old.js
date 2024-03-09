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
  if (!doc) throw new Error(`Invalid id, ${id} does not exist in schema ${schema}`);
  return doc
}

/* ---------------------- Get a users auth with authID ---------------------- */

async function getUserWithID(userID) {
  const user = await User.findOne({ userAuthId: userID })
  if (!user) throw new Error("Invalid user id")
  const { _id, username, admin, } = user
  return {
    _id, username, admin
  }
}

/* ----------------------- Upload Image to Cloudinary ----------------------- */

async function uploadImages(request) {
  const formData = await request.formData()
  const imageUpload = await fetch(`/api/images/upload`, {
      method: 'POST',
      body: formData,
      duplex: true
  }); 

  if (!imageUpload.ok) {
    throw new Error(`Failed to upload images to Cloudinary: ${imageUpload.status} - ${imageUpload.statusText}`);
  }

  const imageResponse = await imageUpload.json();
  return imageResponse
}

/* --------------------- Delete an image from Cloudinary -------------------- */

async function deleteImages(imageArray) {
  try {
    const returnedData = []
    const promises = imageArray.map(async image => {
      const response = await fetch(`/api/image/delete`, {
        method: 'POST',
        body: JSON.stringify({ imageUrl: image })
      })

      returnedData.push(await response.json())
    })

    await Promise.all(promises)

    return {
      success: true,
      message: "Deleted all images on event from Cloudinary",
      data: returnedData
    }
  } catch (error) {
    console.error('Error occurred while deleting image:', error);
    throw new Error(error.message)
  }
}

/* -------------------------------------------------------------------------- */

module.exports = { 
  countVotes, 
  isValid_id, 
  isDuplicate, 
  getUserWithID, 
  generateUserAuthID, 
  hash, 
  deleteImages,
  uploadImages,
}