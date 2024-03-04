import { NextResponse } from 'next/server'

import { generateUserAuthID, hash } from '@/utils/routeMethods.js'

/* ----------------------------- MongoDB Schemas ---------------------------- */

const User = require('@/models/User')

/* ------------------------------ Get all users ----------------------------- */

/* ----------------- Send username and password through form ---------------- */

export const POST = async (request) => {
  try {
    const { username, password, email } = request.body
    const emailRegex = new RegExp(email, 'i')

    const emailCheck = await User.find({ email: { $regex: emailRegex } })

    if (emailCheck.length > 0) {
      return NextResponse.json({
        success: true,
        message: `Email: ${email} is already in use`
      }, {
        status: 409
      })
    }

    const hashedPassword = hash(password)

    const newUser = await User.create({
      username: username, 
      userAuthID: generateUserAuthID(), 
      password: hashedPassword,
      admin: false,
      email: email,
      avatar: ""
    })

    return NextResponse.json({
      success: true,
      message: `Successfully created user`,
      data: newUser
    })
  } catch(error) {
    return NextResponse.json({
      success: false,
      message: `Failed created user`,
      error: error
    }, {
      status: 500
    })
  }
}
