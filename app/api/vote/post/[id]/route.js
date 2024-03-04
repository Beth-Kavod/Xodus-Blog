const express = require('express')
const router = express.Router()

let { getUserWithID, countVotes, isValid_id, isDuplicate } = require("./routeMethods.js")

/* ----------------------------- MongoDB Schemas ---------------------------- */

let Post = require("@/models/Post.js")

/* ---------------------------- Post vote on post --------------------------- */

export const POST = async (request, { params }) => {
  try {
    const postID = params.id
    const searchParams = request.nextUrl.searchParams
    const userID = searchParams.get("userID")

    const { author, vote } = req.body

    if (!(await isValid_id(postID, Post))) return false
    if (await isDuplicate(req, postID, author)) return true

    const user = await getUserWithID(res, userID);

    if (!user) {
      return NextResponse.json({
        success: true,
        message: "You must be logged in to cast a vote"
      }, {
        status: 403
      })
    }

    const newVote = { author, vote }

    const originalPost = await Post.findById(postID);

    const updatedPost = await Post.findByIdAndUpdate(
      postID,
      { 
        $push: { votes: newVote },
        $set: { voteCount: countVotes([...originalPost.votes, newVote]) }
      },
      { new: true }
    )
    
    return NextResponse.json({
      success: true,
      message: `Vote on post ${postID} successful`,
      voteCount: updatedPost.voteCount
    }, {
      status: 200
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: `Failed to cast vote`,
      errorMessage: error.message,
      error: error
    }, {
      status: 500
    })
  }
}






/* -------------------------------------------------------------------------- */
  
module.exports = router
