const availableTags = require('@/data/tags')


/* -------------------------- Remove tags from user ------------------------- */

router.post("/remove-tags/:name", async (req, res, next) => {
  const name = req.params.name
  const userID = req.query.userID
  
  const { removeTags } = req.body

  const user = await getUserWithID(res, userID)

  try {

    if (name !== user.username && !user.admin) {
      res.status(403).json({
        message: `User ${user.username}, not able to edit ${name}'s tags`
      })
      return false
    }

    await userSchema
      .findOne(
        { username: name },
        { new: false }
      )
      .then(result => {
        if (!result) {
          return res.status(404).json({ 
            message: `No user found with the username ${user.username}`
          });
        }

        // Check if all tags in removeTags exist in the tags array of the user
        const tagsExist = removeTags.every(tag => result.tags.includes(tag));

        if (!tagsExist) {
          res.status(400).json({
            message: `Not have every tag in [${removeTags}] exist in the user's tags`,
            removeTags: removeTags,
            status: 400
          });
          return false
        }

        let updatedUser = userSchema.findOneAndUpdate(
          { username: name },
          { $pull: { tags: { $in: removeTags } } },
          { new: true }
        );

        res.status(200).json({
          message: `User ${updatedUser.username} found and updated`,
          removed: removeTags,
          userTags: updatedUser.tags,
          status: 200
        });

        return true
      })
  } catch (err) {
    return next(err)
  }
})
