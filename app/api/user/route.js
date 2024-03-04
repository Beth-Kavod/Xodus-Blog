const express = require('express')
const router = express.Router()
import cloudinary from 'cloudinary'
import filter from 'leo-profanity'
import { NextResponse } from 'next/server'

import { getUserWithID } from '@/utils/routeMethods.js'

/* ----------------------------- MongoDB Schemas ---------------------------- */

const User = require('@/models/User')

/* ------------------------------ Get all users ----------------------------- */

export const GET = async (request) => {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userID = searchParams("userID")
    let user
  
    if (!userID) {
      user = { username: "newUser", id: "", admin: false }
    } else {
  
      user = await getUserWithID(res, userID)
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
  } catch (err) {
    return next(err)
  }
}