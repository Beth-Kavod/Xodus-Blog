import { NextResponse } from 'next/server'

import { getUserWithID } from '@/utils/routeMethods.js'

/* ----------------------------- MongoDB Schemas ---------------------------- */

import User from '@/models/User'

/* ------------------------------ Get all users ----------------------------- */

export const GET = async (request) => {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userID = searchParams.get("userID")
    
    let user
    if (!userID) {
      user = { username: "newUser", id: "", admin: false }
    } else {
  
      user = await getUserWithID(userID)
    }

    await User
      .find()
      .then(users => {
        if (!user.admin) {
          const usernames = users.map((user) => user.username);
  
          return NextResponse.json({
            users: usernames,
            message: `All ${usernames.length} users found`,
            userCount: usernames.length,
          }, {
            status: 200
          });
        } else {
          // If the user is an admin, include all user data in the response
          return NextResponse.json({
            users: users,
            message: `All ${users.length} users found`,
            userCount: users.length,
          }, {
            status: 200
          });
        }
      })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: `Failed to get all users`,
      errorMessage: error.message,
      error: error
    }, {
      status: 500
    })
  }
}