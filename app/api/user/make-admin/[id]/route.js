import { NextResponse } from 'next/server'

import { getUserWithID } from '@/utils/routeMethods.js'

/* ----------------------------- MongoDB Schemas ---------------------------- */

const User = require('@/models/User')

/* -------------------------------------------------------------------------- */

/* ----------------------- Set an account to be admin ----------------------- */

export const POST = async (request, { params }) => {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = params.id
    const userID = searchParams.get("userID")
    const adminQuery = searchParams.get("admin")

    const adminMapping = {
      "true": true,
      "false": false,
    };

    const admin = adminMapping[adminQuery] || null;
    
    if (admin === null) {
      return NextResponse.json({
        success: false,
        message: `Admin query needs to be set as boolean`
      }, {
        status: 422
      })
    }

    let user = await getUserWithID(userID)

    if (!user.admin) {
      return NextResponse.json({
        success: false,
        message: `User with id: ${userID} not allowed to promote users`,
      }, {
        status: 403
      })
    }

    await User
      .findByIdAndUpdate(
        id, 
        { admin: admin },
        { new: true }
      )
      .then(user => {
        if (!user) return NextResponse.json({
          success: false,
          message: `No user was found with id: ${userID}`,
        }, {
          status: 404
        })

        let message = admin ? `User ${user.username} found and given admin` : `User ${user.username} found and revoked admin`
        return NextResponse.json({
          success: true,
          message: message,
          name: user.username,
          id: user._id
        }, {
          status: 200
        })
      }) 
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: `Failed to make user an admin`,
      errorMessage: error.message,
      error: error
    }, {
      status: 500
    })
  }
}