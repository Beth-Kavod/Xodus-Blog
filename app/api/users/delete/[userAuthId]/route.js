import { NextResponse } from 'next/server'

import { getUserWithID } from '@/utils/routeMethods'

/* ----------------------------- MongoDB Schemas ---------------------------- */

import User from '@/models/User'

/* ------------------------------- Delete user ------------------------------ */

export const POST = async (request, { params }) => {
  try {
    const searchParams = request.nextUrl.searchParams
    const userAuthId = params.userAuthId
    const userID = searchParams.get("userID")

    let user = await getUserWithID(userID)

    if (!user.admin) {
      return NextResponse.json({
        success: false,
        message: `User ${user.username} not allowed to delete users`,
        data: data
      }, {
        status: 403
      })
    }

    await User.deleteOne({ userAuthId: userAuthId })
    return NextResponse.json({
      success: true,
      message: `Successfully deleted user`,
      data: data
    }, {
      status: 200
    })
  } catch(error) {
    return NextResponse.json({
      success: false,
      message: `Failed to delete user`,
      errorMessage: error.message,
      error: error
    }, {
      status: 500
    })
    
  }
}
