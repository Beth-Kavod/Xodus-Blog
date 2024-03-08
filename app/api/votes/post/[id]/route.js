import { NextResponse } from 'next/server'
import { getUserWithID, countVotes, isValid_id, isDuplicate } from "@/utils/routeMethods.js"

/* ----------------------------- MongoDB Schemas ---------------------------- */

import Post from "@/models/Post.js"

/* ---------------------------- Post vote on post --------------------------- */

export const POST = async (request, { params }) => {
  try {
    const postID = params.id
    const searchParams = request.nextUrl.searchParams
    const userID = searchParams.get("userID")

    console.log(request.json)
    const originalPost = await isValid_id(postID, Post)

    /* if (await isDuplicate(postID, author)) return NextResponse.json({
      success: true,
      message: `Updated vote on post: ${postID}`
    }, {
      status: 200
    }) */
    
    const user = await getUserWithID(userID);
    
    if (!user) {
      return NextResponse.json({
        success: false,
        message: "You must be logged in to cast a vote"
      }, {
        status: 403
      })
    }
    const newVote =  { user, vote } = await request.json()
    if (!newVote) {
      return NextResponse.json({
        success: false,
        message: "No vote data provided"
      }, {
        status: 400
      })
    }
    // const countVotes = (votes) => votes.length

    const updatedPost = await Post.findByIdAndUpdate(
      postID,
      { 
        $push: { votes: { ...newVote, date: new Date } },
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