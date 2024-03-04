import { NextResponse } from 'next/server'

import { getUserWithID, isValid_id } from '@/utils/routeMethods.js'

/* ----------------------------- MongoDB Schemas ---------------------------- */

import Comment from '@/models/Comment'

/* -------------------------------------------------------------------------- */

/* ------------------------ Get all Comments on post ------------------------ */

export const GET = async (request, { params }) => {
  const postID = params.id

  if (!await isValid_id(postID, Post)) return false
  
  try {
    await Comment
    .find({
      postID: postID
    })
    .then((result) => {
      let voteCount = !result.votes ? 0 : countVotes(result.votes)

      return NextResponse.json({
        success: true,
        message: "Comments successfully fetched",
        data: result.reverse(),
        voteCount: voteCount,
      }, {
        status: 200
      })
    })
  } catch(error) {
    return NextResponse.json({
      success: false,
      message: `Failed to get comment`,
      errorMessage: error.message,
      error: error
    }, {
      status: 500
    })
    
  }
}