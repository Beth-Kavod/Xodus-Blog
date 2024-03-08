# Pages to check
- Accounts
  - create
  - login
  - profile/[username]
- Posts
  - [id]
  - create

As you check the pages check each of the components to make sure there is no wasted resources

# CONVERSION
- Fix User, Post, Comment and Vote routes
- finish update-profile route
- finish update-avatar route
- Fix create posts images not working
- Fix suspense error
- Rework comment API to populate instead of separate route


# ToDo
- Add auth headers to all post requests to replace userID query
- FIX CREATE POST BACK BEING WHITE??
- Fix image upload route to change upload_preset based on formData 
- Finish Postman routes for testing
- Make editPost page, API already set up // something like this is already there, not completely necessary

- Make profile page not display if res.status === 404
- Make create post button disabled until image is uploaded into cloudinary (image doesent upload if done to fast)