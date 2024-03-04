/* ----------------- Send username and password through form ---------------- */

router.post("/create", async (req, res, next) => {
  const {username, password, email} = req.body
  const emailRegex = new RegExp(email, 'i')

  try {

    const emailCheck = await userSchema.find({ email: { $regex: emailRegex } })

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
      await userSchema.create({
        username: username, 
        userAuthID: data.user.ID, 
        admin: false,
        email: email,
        data: data.data,
        avatar: ""
      })
      res.status(201).json(data)
      return true
    }
    res.status(500).json({
      message: `Something went wrong`
    })
  } catch(err) {
    return next(err)
  }
})
