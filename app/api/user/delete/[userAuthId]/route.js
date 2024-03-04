
/* ------------------------------- Delete user ------------------------------ */

router.post("/delete/:userAuthID", async (req, res, next) => {
  const userAuthID = req.params.userAuthID
  const userID = req.query.userID

  let user = await getUserWithID(res, userID)

  if (!user.admin) {
    res.status(403).json({
      message: `User ${user.username} not allowed to delete users`
    })
  }

  try {
    const response = await fetch("http://54.176.161.136:8080/users/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        applicationId: appId, 
        ID: userAuthID
      })
    })

    const data = await response.json()

    if (data.status === 200) {
      await userSchema.deleteOne({userAuthID: userAuthID})
      res.status(200).json(data)
    } else {
      res.status(500).json({
        data,
        message: `Something went wrong`
      })
    }
  } catch(err) {
    next(err)
  }
})
