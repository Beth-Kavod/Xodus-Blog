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
    let { author, content } = await request.json() 

    content = filter.clean(content);
    
    await isValid_id(postID, Post)

    const newComment = await Comment
      .create({
        author, 
        content,
        votes: [],
        date: new Date().toISOString(),
        postID: postID
      })

    const commentResponse = await newComment.json()
    
    if (newComment.ok) {
      return NextResponse.json({
        success: true,
        message: "Comment successfully created",
        data: commentResponse
      }, {
        status: 200
      })
    } else {
      throw new Error('Failed to create comment document')
    }
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
