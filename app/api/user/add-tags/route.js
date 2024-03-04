const availableTags = require('@/data/tags')


/* ---------------------------- Add tags to user ---------------------------- */

router.post("/add-tags/:name", async (req, res, next) => {
  const name = req.params.name
  const userID = req.query.userID
  
  const { newTags }= req.body

  const user = await getUserWithID(res, userID)

  try {

    if (name !== user.username/*  && !user.admin */) {
      res.status(403).json({
        message: `User ${user.username}, not able to edit ${name}'s tags`
      })
      return false
    }

    const allTagsIncluded = newTags.every(tag => availableTags.includes(tag));

    if (!allTagsIncluded && !user.admin) {
      res.status(403).json({
        message: `One of [${newTags}] is not an available tag for user ${user.username}`
      })
      return false
    }

    await userSchema
      .findOneAndUpdate(
        {username: name},
        { $addToSet: { tags: { $each: newTags } } },
        { new: true }
      )
      .then(result => {
        if (!result) return res.status(404).json({ 
          message: `No user found with the username ${user.username}`
        })
        
        res.status(200).json({
          message: `User ${result.username} found and updated`, 
          added: newTags,
          status: 200
        })
      }) 
  } catch (err) {
    return next(err)
  }
})