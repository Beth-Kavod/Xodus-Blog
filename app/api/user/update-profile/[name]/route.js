import { NextResponse } from 'next/server'

import { getUserWithID } from '@/utils/routeMethods.js'

/* ----------------------------- MongoDB Schemas ---------------------------- */

const User = require('@/models/User')

/* -------------------------------------------------------------------------- */

/* -------------------- Update users profile information -------------------- */
// ! NOT FINISHED, UPDATING PROFILE NOT USEFUL
router.post("/update-profile/:name", async (req, res, next) => {
  const name = req.params.name
  const userID = req.query.userID

  const user = await getUserWithID(res, userID)
  // ! ADD MORE FIELDS LATER
  const { email } = req.body

  try {

    if (name !== user.username && !user.admin) {
      res.status(403).json({
        message: `User ${name}, not able to edit ${user.username}'s profile`
      })
      return false
    }

    await User
      .findOneAndUpdate(
        {username: name}, 
        {email: email},
        {new: true}
      )
      .then(result => {
        if (!result) return res.status(404).json({ 
          message: `No user found with the username ${user.username}`
        })
        
        res.status(200).json({
          message: `User ${result.username} found and updated`, 
          status: 200
        })
      }) 
  } catch (err) {
    return next(err)
  }
})
