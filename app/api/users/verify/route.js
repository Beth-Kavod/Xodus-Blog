import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
// import { hash } from '@/utils/routeMethods.js'

/* ----------------------------- MongoDB Schemas ---------------------------- */

import User from '@/models/User'

/* -------------------------------------------------------------------------- */

/* ----------------- Send username and password through form ---------------- */

export const POST = async (request) => {
  try {
    const { username, password } = await request.json()

    const foundUser = await User.findOne({ username: username })
    if (!foundUser.password) throw new Error(`No user with name: ${username}`)

    const passwordMatch = await bcrypt.compare(password, foundUser.password)

    if (!passwordMatch) throw new Error("Wrong credentials")

    const { userAuthId, email, admin, tags } = foundUser

    return NextResponse.json({
      success: true,
      message: `Successfully verified user`,
      data: {
        username, userAuthId, email, admin, tags
      }
    }, {
      status: 200
    })
  } catch(error) {
    return NextResponse.json({
      success: false,
      message: `Failed to verify user`,
      errorMessage: error.message,
      error: error
    }, {
      status: 500
    })
  }
}