import { NextResponse } from 'next/server'

import { isValid_id } from '@/utils/routeMethods'

/* ----------------------------- MongoDB Schemas ---------------------------- */

import Post from '@/models/Post'
import Comment from '@/models/Comment'

/* -------------------------------------------------------------------------- */

/* ------------------------ Get all Comments on post ------------------------ */

export const GET = async (request, { params }) => {
  try {
    const postID = params.id
  
    await isValid_id(postID, Post)
    
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