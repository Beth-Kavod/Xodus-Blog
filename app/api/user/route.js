const express = require('express')
const router = express.Router()
const cloudinary = require('cloudinary')
const filter = require('leo-profanity');

import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/utils/mongoose'

const { getUserWithID } = require('@/utils/routeMethods.js')

/* ----------------------------- MongoDB Schemas ---------------------------- */

const userSchema = require('@/models/User')

// All users start with /users

/* ------------------------------ Get all users ----------------------------- */

export const GET = async (request) => {
  try {
    await connectToDatabase()
    const searchParams = request.nextUrl.searchParams;
    const userID = searchParams("userID")
    let user
  
    if (!userID) {
      user = { username: "newUser", id: "", admin: false }
    } else {
  
      user = await getUserWithID(res, userID)
    }

    await userSchema
      .find()
      .then(users => {
        if (!user.admin) {
          const usernames = users.map((user) => user.username);
  
          res.status(200).json({
            users: usernames,
            message: `All ${usernames.length} users found`,
            userCount: usernames.length,
            status: 200,
          });
        } else {
          // If the user is an admin, include all user data in the response
          res.status(200).json({
            users: users,
            message: `All ${users.length} users found`,
            userCount: users.length,
            status: 200,
          });
        }
      })
  } catch (err) {
    return next(err)
  }
}