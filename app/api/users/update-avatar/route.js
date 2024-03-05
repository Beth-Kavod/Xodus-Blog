import { NextResponse } from 'next/server'

import { getUserWithID } from '@/utils/routeMethods.js'

/* ----------------------------- MongoDB Schemas ---------------------------- */

import User from '@/models/User'
import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript';

/* -------------------------------------------------------------------------- */

/* --------------------------- Update users avatar -------------------------- */

export const POST = async (request, { params }) => {
  try {
    const { username, image } = await request.json();
    
    const user = await User.findOne({ username })
    console.log(image)
    /* if (user.avatar) {
      const publicId = user.avatar.split('/').pop().split('.')[0];
      cloudinary.v2.api
        .delete_resources([`Avatars/${publicId}`], 
          { type: 'upload', resource_type: 'image' })
    } */
    return NextResponse.json({ data: image})

    const uploadImage = await fetch(`/api/images/upload`, {
      method: 'POST',
      body: {
        image
      }
    })



    const updatedUser = await User.findOneAndUpdate(
      { username }, 
      { avatar: url }, 
      { new: true }
    )

    return NextResponse.json({
      success: true,
      message: `${username}'s avatar was updated.`,
      data: updatedUser.avatar
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
