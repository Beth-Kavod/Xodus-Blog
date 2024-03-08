
import { NextResponse } from 'next/server'
import filter from 'leo-profanity'
import { getUserWithID, isValid_id } from '@/utils/routeMethods.js'

/* ----------------------------- MongoDB Schemas ---------------------------- */

import Post from '@/models/Post'

/* -------------------------------------------------------------------------- */

/* --------------------------- Edit post with _id --------------------------- */

export const POST = async (request, { params }) => {
  try {
    const postID = params.id
    const searchParams = request.nextUrl.searchParams
    const userID = searchParams.get("userID")

    const user = await getUserWithID(userID)
  
    const post = await isValid_id(postID, Post)
    
    const body = await request.json()
    
    if (user.username !== post.author && !user.admin) {
      return NextResponse.json({
        success: true,
        message: `User ${user.username} not authorized to edit ${post.author}'s post`
      }, {
        status: 403
      })
    }

    body.content = filter.clean(body.content);
    body.title = filter.clean(body.title);

    const updatedPost = await Post.findByIdAndUpdate(postID, body, { new: true })
    
    return NextResponse.json({
      success: true,
      voteCount: updatedPost.voteCount,
      message: "Data successfully updated",
      data: updatedPost
    }, {
      status: 200
    })
  } catch(error) {
    return NextResponse.json({
      success: false,
      message: `Failed to edit post`,
      errorMessage: error.message,
      error: error
    }, {
      status: 500
    })
  }
}