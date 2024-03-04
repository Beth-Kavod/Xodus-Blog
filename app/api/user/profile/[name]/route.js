/* ----------------------- Get users profile with name ---------------------- */

router.get("/profile/:name", async (req, res, next) => {
  const name = req.params.name
  const userID = req.query.userID
  let request

  if (!userID) {
    request = { username: "", id: "", admin: false} 
  } else {
    request = await getUserWithID(res, userID)
  }

  try {

    await userSchema
      .findOne({username: name})
      .then(user => {
        if (!user) return res.status(404).json({ message: `No user found with the username ${name}` })
        
        const { username, admin, avatar, createdAt } = user

        if (request.username === name || request.admin) {
          res.status(200).json({
            user,
            message: `User ${user.username} found`, 
          })
          return
        } else {
          res.status(200).json({
            user: {
              username,
              admin, 
              avatar, 
              createdAt,
            },
            message: `User ${user.username} found`, 
          })
          return
        }
      }) 
  } catch(err) {
    return next(err)
  }
})