import { NextResponse } from 'next/server'

import { isValid_id } from '@/utils/routeMethods.js'

/* ----------------------------- MongoDB Schemas ---------------------------- */

import Post from '@/models/Post'

/* -------------------------------------------------------------------------- */

/* --------------------------- Get a post with _id -------------------------- */

export const GET = async (request, { params }) => {
  try {
    const postID = params.id
  
    await isValid_id(postID, Post)
    
    await Post
    .findById(postID)
    .then((result) => {
      return NextResponse.json({
        success: true,
        voteCount: result.voteCount,
        message: "Post successfully fetched",
        data: result
      }, {
        status: 200
      })
    })
  } catch(error) {
    return NextResponse.json({
      success: false,
      message: `Failed to fetch post`,
      errorMessage: error.message,
      error: error
    }, {
      status: 500
    })
  }
}
