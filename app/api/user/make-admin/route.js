/* ----------------------- Set an account to be admin ----------------------- */

router.post("/make-admin/:id", async (req, res, next) => {
  const id = req.params.id
  const userID = req.query.userID

  const adminMapping = {
    "true": true,
    "false": false,
  };

  const admin = adminMapping[req.query.admin] || null;
  
  if (req.query.admin === null) {
    res.status(422).json({
      message: `Admin query needs to be set as boolean`
    })
    return false
  }

  let user = await getUserWithID(res, userID)

  if (!user.admin) {
    res.status(403).json({
      message: `User with id: ${userID} not allowed to promote users`
    })
    return false
  }

  try {

    await userSchema
      .findByIdAndUpdate(
        id, 
        { admin: admin },
        { new: true }
      )
      .then(user => {
        if (!user) return res.status(404).json({
          message: `No user found with the _id: ${id}`
        })
        let message = admin ? `User ${user.username} found and given admin` : `User ${user.username} found and revoked admin`
        res.status(200).json({
          name: user.username, 
          id: user._id, 
          message: message, 
          status: 200
        })
      }) 
  } catch (err) {
    return next(err)
  }
})
