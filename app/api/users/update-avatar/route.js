import { NextResponse } from 'next/server'

import { getUserWithID } from '@/utils/routeMethods.js'

/* ----------------------------- MongoDB Schemas ---------------------------- */

import User from '@/models/User'

/* -------------------------------------------------------------------------- */

/* --------------------------- Update users avatar -------------------------- */

export const POST = async (request, { params }) => {
  try {
    const { username, url } = await request.json();
    
    const user = await User.findOne({ username })

    if (user.avatar) {
      const publicId = user.avatar.split('/').pop().split('.')[0];
      cloudinary.v2.api
        .delete_resources([`Avatars/${publicId}`], 
          { type: 'upload', resource_type: 'image' })
    }

    await User.findOneAndUpdate(
      { username }, 
      { avatar: url }, 
      { new: true }
    )

    return NextResponse.json({
      success: true,
      message: `${username}'s avatar was updated.`
    }, {
      status: 201
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      errorMessage: error.message,
      error: error
    }, {
      status: 500
    })
  }
}
