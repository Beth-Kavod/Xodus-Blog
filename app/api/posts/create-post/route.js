import { NextResponse } from 'next/server'
import filter from 'leo-profanity'
/* ----------------------------- MongoDB Schemas ---------------------------- */

import Post from '@/models/Post'

/* -------------------------------------------------------------------------- */

/* -------------------------- Create post from form ------------------------- */

export const POST = async (request) => {
  try {
    const body = await request.json()
    body.content = filter.clean(body.content);
    body.title = filter.clean(body.title);
    const result = await Post.create(body);

    return NextResponse.json({
      success: true,
      message: "Data successfully uploaded",
      data: result
    }, {
      status: 201
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: `Failed to create post`,
      errorMessage: error.message,
      error: error
    }, {
      status: 500
    })
    
  }
}