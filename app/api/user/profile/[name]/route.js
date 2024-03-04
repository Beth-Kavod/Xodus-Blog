/* ----------------------- Get users profile with name ---------------------- */

export const GET = async (request, { params }) => {
  try {
    const searchParams = request.nextUrl.searchParams
    const name = params.name
    const userID = searchParams.get("userID")

    let requestedUser
    if (!userID) {
      requestedUser = { username: "", id: "", admin: false} 
    } else {
      requestedUser = await getUserWithID(res, userID)
    }

    await User
      .findOne({username: name})
      .then(user => {
        if (!user) return NextResponse.json({
          success: false,
          message: `No user found with the username ${name}`,
          data: data
        }, {
          status: 404
        }) 
        
        const { username, admin, avatar, createdAt } = user

        if (requestedUser.username === name || requestedUser.admin) {
          return NextResponse.json({
            success: true,
            message: `User ${user.username} found`, 
            data: user
          }, {
            status: 200
          })
        } else {
          return NextResponse.json({
            success: true,
            user: {
              username,
              admin, 
              avatar, 
              createdAt,
            },
            message: `User ${user.username} found`
          }, {
            status: 200
          })
        }
      }) 
  } catch(error) {
    return NextResponse.json({
      success: false,
      message: `Failed to fetch profile`,
      errorMessage: error.message,
      error: error
    }, {
      status: 500
    })    
  }
}