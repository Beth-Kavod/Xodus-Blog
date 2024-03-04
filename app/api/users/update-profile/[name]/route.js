import { NextResponse } from 'next/server'

import { getUserWithID } from '@/utils/routeMethods.js'

/* ----------------------------- MongoDB Schemas ---------------------------- */

const User = require('@/models/User')

/* -------------------------------------------------------------------------- */

/* -------------------- Update users profile information -------------------- */
// ! NOT FINISHED, UPDATING PROFILE NOT USEFUL
export const POST = async (request, { params }) => {
  try {
    const name = params.name
    const searchParams = request.nextUrl.searchParams
    const userID = searchParams.get("userID")

    const user = await getUserWithID(res, userID)
    // ! ADD MORE FIELDS LATER
    const { email } = req.body


    if (name !== user.username && !user.admin) {
      return NextResponse.json({
        success: true,
        message: `User ${name}, not able to edit ${user.username}'s profile`
      }, {
        status: 403
      })
    }

    await User
      .findOneAndUpdate(
        {username: name}, 
        {email: email},
        {new: true}
      )
      .then(result => {
        if (!result) return NextResponse.json({
          success: false,
          message: `No user found with the username ${user.username}`
        }, {
          status: 404
        })

        return NextResponse.json({
          success: true,
          message: `User ${result.username} found and updated`, 
          data: data
        }, {
          status: 200
        })
      }) 
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: `Failed to update profile`,
      errorMessage: error.message,
      error: error
    }, {
      status: 500
    })
  }
}