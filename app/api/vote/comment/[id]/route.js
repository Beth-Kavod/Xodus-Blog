import { NextResponse } from 'next/server'

import { getUserWithID, isValid_id, isDuplicate } from '@/utils/routeMethods.js'

/* ----------------------------- MongoDB Schemas ---------------------------- */

import Comment from '@/models/Comment'

/* -------------------------------------------------------------------------- */

/* -------------------------- Post vote on comment -------------------------- */

export const POST = async (request, { params }) => {
  try {
    const commentID = params.id;
    const searchParams = request.nextUrl.searchParams
    const userID = searchParams.get("userID")

    let { author, vote } = req.body

    if (!await isValid_id(commentID, Comment)) return false;
    if (await isDuplicate(req, commentID, author)) return true;

    const user = await getUserWithID(userID)

    if (!user) {
      return NextResponse.json({
        success: false,
        message: `Cant find user with id: ${userID}`
      }, {
        status: 403
      })
    }

    const newVote = { author, vote }

    const originalComment = await Comment.findById(commentID);

    const updatedComment = await Comment.findByIdAndUpdate(
      commentID,
      { 
        $push: { votes: newVote },
        $set: { voteCount: countVotes([...originalComment.votes, newVote]) }
      },
      { new: true }
    )
    
    const voteCount = updatedComment.voteCount;

    return NextResponse.json({
      success: true,
      message: `Vote on comment ${commentID} successful`,
      voteCount: voteCount,
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