
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
  
    await isValid_id(postID, Post)
    
    const post = await Post.findById(postID);
    
    if (user.username !== post.author && !user.admin) {
      return NextResponse.json({
        success: true,
        message: `User ${user.username} not authorized to edit ${post.author}'s post`
      }, {
        status: 403
      })
    }

    request.body.content = filter.clean(request.body.content);
    request.body.title = filter.clean(request.body.title);

    await Post  
    .findByIdAndUpdate(postID, request.body, { new: true })
    .then(result => {
      return NextResponse.json({
        success: true,
        voteCount: result.voteCount,
        message: "Data successfully updated",
        data: result
      }, {
        status: 200
      })
      
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