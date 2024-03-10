import availableTags from '@/data/tags'

import { NextResponse } from 'next/server'

import { getUserWithID } from '@/utils/routeMethods'

/* ----------------------------- MongoDB Schemas ---------------------------- */

import User from '@/models/User'

/* -------------------------------------------------------------------------- */


/* -------------------------- Remove tags from user ------------------------- */

export const POST = async (request, { params }) => {
  try {
    const name = params.name
    const searchParams = request.nextUrl.searchParams
    const userID = searchParams.get("userID")
    
    const { removeTags } = await request.json()

    const user = await getUserWithID(res, userID)

    if (name !== user.username && !user.admin) {
      return NextResponse.json({
        success: false,
        message: `User ${user.username}, not able to edit ${name}'s tags`
      }, {
        status: 403
      })
    }

    await User
      .findOne(
        { username: name },
        { new: false }
      )
      .then(result => {
        if (!result) {
          return NextResponse.json({
            success: true,
            message: `No user found with the username ${user.username}`
          }, {
            status: 404
          })
        }

        // Check if all tags in removeTags exist in the tags array of the user
        const tagsExist = removeTags.every(tag => result.tags.includes(tag));

        if (!tagsExist) {
          return NextResponse.json({
            success: false,
            message: `Not have every tag in [${removeTags}] exist in the user's tags`,
            removeTags: removeTags
          }, {
            status: 400
          })
        }

        let updatedUser = User.findOneAndUpdate(
          { username: name },
          { $pull: { tags: { $in: removeTags } } },
          { new: true }
        );

        return NextResponse.json({
          success: true,
          message: `User ${updatedUser.username} found and updated`,
          removed: removeTags,
          userTags: updatedUser.tags
        }, {
          status: 200
        })
      })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: `Failed to delete tags from user`,
      errorMessage: error.message,
      error: error
    }, {
      status: 500
    })
  }
}
