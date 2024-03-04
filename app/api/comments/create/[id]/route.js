import { NextResponse } from 'next/server'
import filter from 'leo-profanity'

import { isValid_id } from '@/utils/routeMethods.js'

/* ----------------------------- MongoDB Schemas ---------------------------- */

import Post from '@/models/Post'
import Comment from '@/models/Comment'

/* -------------------------------------------------------------------------- */

/* ------------------------------ Make comment ------------------------------ */

export const POST = async (request, { params }) => {
  try {
    const postID = params.id

    request.body.content = filter.clean(request.body.content);
    
    await isValid_id(postID, Post)

    await Comment
    .create({
      ...request.body,
      postID: postID
    })
    .then(result => {
      return NextResponse.json({
        success: true,
        message: "Comment successfully created",
        data: result
      }, {
        status: 200
      })
    })
  } catch(error) {
    return NextResponse.json({
      success: false,
      message: `Failed to create comment`,
      errorMessage: error.message,
      error: error
    }, {
      status: 500
    })
  }
}
