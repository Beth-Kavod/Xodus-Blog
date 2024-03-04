import { NextResponse } from 'next/server'

import { getUserWithID } from '@/utils/routeMethods.js'

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
      res.status(409).json({
        message: `Email ${email} is already in use`
      })
      return false
    }

    const response = await fetch("http://54.176.161.136:8080/users/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        applicationId: appId, 
        username: filter.clean(username), 
        password: password, 
        data: "{}"
      })
    })
  
    const data = await response.json()
    
    if (data.status === 201) {
      await User.create({
        username: username, 
        userAuthID: data.user.ID, 
        admin: false,
        email: email,
        data: data.data,
        avatar: ""
      })
      return NextResponse.json({
        success: true,
        message: `Successfully created user`,
        data: data
      })
    }
    return NextResponse.json({
      message: `Something went wrong`
    }, {
      status: 500
    })
  } catch(err) {
    return NextResponse.json({
      success: false,
      message: `Failed created user`,
      error: error
    })
  }
}
