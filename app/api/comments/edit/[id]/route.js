import { NextResponse } from 'next/server'
import filter from 'leo-profanity'

import { getUserWithID } from '@/utils/routeMethods'

/* ----------------------------- MongoDB Schemas ---------------------------- */

import Comment from '@/models/Comment'

/* -------------------------------------------------------------------------- */

/* ------------------------------ Edit comment ------------------------------ */

export const POST = async (request, { params }) => {
  try {
    const commentID = params.id
    const searchParams = request.nextUrl.searchParams
    const userID = searchParams.get("userID")

    const user = await getUserWithID(userID)

    await isValid_id(commentID, Comment)

    const comment = await Comment.findById(commentID)

    const body = await request.json()

    if (user.username !== comment.author && !user.admin) {
      return NextResponse.json({
        success: false,
        message: `User ${user.username} not authorized to edit ${comment.author}'s comment`
      }, {
        status: 403
      })
    }

    body.content = filter.clean(body.content);

    await Comment
    .findByIdAndUpdate(commentID, body, { new: true })
    .then(content => {
      return NextResponse.json({
        success: true,
        message: "Comment updated successfully",
        comment: content
      }, {
        status: 200
      })
      
    })
  } catch(error) {
    return NextResponse.json({
      success: false,
      message: `Failed to edit comment`,
      errorMessage: error.message,
      error: error
    }, {
      status: 500
    })
  }
}