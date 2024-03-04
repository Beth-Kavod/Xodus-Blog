import { NextResponse } from 'next/server'

import { getUserWithID } from '@/utils/routeMethods.js'

/* ----------------------------- MongoDB Schemas ---------------------------- */

const User = require('@/models/User')

/* ------------------------------- Delete user ------------------------------ */

export const POST = async (request, { params }) => {
  const searchParams = request.nextUrl.searchParams
  const userAuthID = params.userAuthId
  const userID = searchParams.get("userID")

  let user = await getUserWithID(res, userID)

  if (!user.admin) {
    return NextResponse.json({
      success: false,
      message: `User ${user.username} not allowed to delete users`,
      data: data
    }, {
      status: 403
    })
  }

  try {
    const response = await fetch("http://54.176.161.136:8080/users/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        applicationId: appId, 
        ID: userAuthID
      })
    })

    const data = await response.json()

    if (data.status === 200) {
      await User.deleteOne({userAuthID: userAuthID})
      return NextResponse.json({
        success: true,
        message: ``,
        data: data
      }, {
        status: 200
      })
    } else {
      res.status(500).json({
        data,
        message: `Something went wrong`
      })
    }
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
