import { NextResponse } from 'next/server'
import cloudinary from 'cloudinary'

import { getUserWithID, isValid_id } from '@/utils/routeMethods.js'

/* ----------------------------- MongoDB Schemas ---------------------------- */

import Post from '@/models/Post'
import Comment from '@/models/Comment'

/* -------------------------------------------------------------------------- */

/* -------------------------- Delete post with _id -------------------------- */

export const POST = async (request, { params }) => {
  const postID = params.id
  const searchParams = request.nextUrl.searchParams
  const userID = searchParams.get("userID")

  const user = await getUserWithID(userID)

  if (!await isValid_id(postID, Post)) return false
  
  try {
    const post = await Post.findById(postID)

    if (user.username !== post.author && !user.admin) {
      return NextResponse.json({
        success: true,
        message: `User ${user.username} not authorized to delete ${post.author}'s post`
      }, {
        status: 403
      })
    }

    const deletePromises = [
      Post.findByIdAndRemove(postID),
      Comment.deleteMany({ postID: postID })
    ]
    
    if (post.imageUrl) {
      const publicId = post.imageUrl.split('/').pop().split('.')[0]
      await cloudinary.v2.api.delete_resources(
        [`BlogImages/${publicId}`], 
        { type: 'upload', resource_type: 'image' }
      )
    }
    
    await Promise.all(deletePromises)

    return NextResponse.json({
      success: true,
      message: `All info related to post: ${postID} has been deleted`,
      data: data
    }, {
      status: 200
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: `Failed to delete post`,
      errorMessage: error.message,
      error: error
    }, {
      status: 500
    })
    
  }
}