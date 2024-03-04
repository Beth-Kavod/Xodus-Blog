const availableTags = require('@/data/tags')
import { NextResponse } from 'next/server'

import { getUserWithID } from '@/utils/routeMethods.js'

/* ----------------------------- MongoDB Schemas ---------------------------- */

const User = require('@/models/User')

/* ------------------------------ Get all users ----------------------------- */

/* ---------------------------- Add tags to user ---------------------------- */

export const POST = async (request) => {
  try {
    const searchParams = request.nextUrl.searchParams
    const name = searchParams.get("name")
    const userID = searchParams("userID")
    
    const { newTags }= req.body

    const user = await getUserWithID(res, userID)

    if (name !== user.username/*  && !user.admin */) {
      return NextResponse.json({
        success: false,
        message: `User ${user.username}, not able to edit ${name}'s tags`,
        data: data
      }, {
        status: 403
      })
    }

    const allTagsIncluded = newTags.every(tag => availableTags.includes(tag));

    if (!allTagsIncluded && !user.admin) {
      return NextResponse.json({
        success: true,
        message: `One of [${newTags}] is not an available tag for user ${user.username}`,
        data: data
      }, {
        status: 403
      })
    }

    await userSchema
      .findOneAndUpdate(
        { username: name },
        { $addToSet: { tags: { $each: newTags } } },
        { new: true }
      )
      .then(result => {
        if (!result) return res.status(404).json({ 
          message: `No user found with the username ${user.username}`
        })
        return NextResponse.json({
          success: true,
          message: `User ${result.username} found and updated`, 
          added: newTags,
          data: data
        }, {
          status: 200
        })
      }) 
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: `Failed to add new tags`,
      errorMessage: error.message,
      error: error
    }, {
      status: 500
    })
    
  }
}