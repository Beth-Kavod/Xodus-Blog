import { NextResponse } from 'next/server'

import { getUserWithID, isValid_id } from '@/utils/routeMethods.js'

/* ----------------------------- MongoDB Schemas ---------------------------- */

import Comment from '@/models/Comment'

/* -------------------------------------------------------------------------- */

/* ----------------------------- Delete comment ----------------------------- */

export const POST = async (request, { params }) => {
  try {
    const commentID = params.id
    const searchParams = request.nextUrl.searchParams
    const userID = searchParams.get("userID")

    const user = await getUserWithID(userID)

    await isValid_id(commentID, Comment)
  
    const comment = await Comment.findById(commentID)

    if (user.username !== comment.author && !user.admin) {
      return NextResponse.json({
        success: false,
        message: 'You do not have permission to delete this comment'
      }, {
        status: 403
      })
    }

    await Comment.findByIdAndDelete(commentID)
    
    return NextResponse.json({
      success: true,
      message: "Comment and votes successfully Deleted",
    }, {
      status: 204
    })
  } catch(error) {
    return NextResponse.json({
      success: false,
      message: `Failed to delete comment`,
      errorMessage: error.message,
      error: error
    }, {
      status: 500
    })
    
  }
}