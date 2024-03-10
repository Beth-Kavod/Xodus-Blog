import { NextResponse } from 'next/server'

import { getUserWithID } from '@/utils/routeMethods'

/* ----------------------------- MongoDB Schemas ---------------------------- */

import User from '@/models/User'

/* ----------------------- Get users profile with name ---------------------- */

export const GET = async (request, { params }) => {
  try {
    const searchParams = request.nextUrl.searchParams
    const name = params.name
    const userID = searchParams.get("userID")
    // console.log(params)
    let requestedUser
    if (!userID) {
      requestedUser = { username: "", id: "", admin: false} 
    } else {
      requestedUser = await getUserWithID(userID)
    }

    const foundUser = await User.findOne({ username: name })

    if (!foundUser) return NextResponse.json({
      success: false,
      message: `No user found with the username ${name}`,
    }, {
      status: 404
    }) 
    
    const { username, admin, avatar, createdAt, _id, email, tags } = foundUser
    // console.log(foundUser)

    if (requestedUser.username === name || requestedUser.admin) {
      return NextResponse.json({
        success: true,
        message: `User ${foundUser.username} found`, 
        data: {
          _id,
          tags,
          email,
          username,
          admin, 
          avatar, 
          createdAt,
        }
      }, {
        status: 200
      })
    } else {
      return NextResponse.json({
        success: true,
        message: `User ${foundUser.username} found`,
        data: {
          tags,
          username,
          admin, 
          avatar, 
          createdAt,
        }
      }, {
        status: 200
      })
    }    
  } catch(error) {
    return NextResponse.json({
      success: false,
      message: `Failed to fetch profile`,
      errorMessage: error.message,
      error: error
    }, {
      status: 500
    })    
  }
}