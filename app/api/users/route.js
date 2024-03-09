import { NextResponse } from 'next/server'

import { getUserWithID } from '@/utils/routeMethods'

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

    const foundUsers = await User.find()

    if (!user.admin) {
      const usernames = foundUsers.map((user) => user.username);

      return NextResponse.json({
        users: usernames,
        message: `All ${usernames.length} users found`,
        userCount: usernames.length,
      }, {
        status: 200
      });
    }
    
    // If the user is an admin, include all user data in the response
    return NextResponse.json({
      users: foundUsers,
      message: `All ${users.length} users found`,
      userCount: foundUsers.length,
    }, {
      status: 200
    });

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