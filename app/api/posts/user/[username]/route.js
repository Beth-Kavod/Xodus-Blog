import { NextResponse } from 'next/server'

/* ----------------------------- MongoDB schemas ---------------------------- */

import Post from '@/models/Post'
// All posts start with /posts

/* ------------------------ Get all of a users posts ------------------------ */

export const GET = async (request, { params }) => {
  try {
    const username = params.username;
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get("page")) || 1
    const PAGE_SIZE = parseInt(searchParams.get("size")) || 10

    const totalResults = await Post.countDocuments({ author: username })

    const results = await Post
      .find({ author: username })
      .skip((page - 1) * PAGE_SIZE) // Calculate how many documents to skip based on the page number
      .sort({ createdAt: -1 }) // Sort by date
      .limit(PAGE_SIZE) // Limit the number of documents per page
    console.log(results)
    let message = results.length === 0 ? 'No posts found from search' : 'Search results successfully fetched';

    return NextResponse.json({
      success: true,
      message: message,
      data: results,
      count: results.length,
      currentPage: page,
      totalPosts: totalResults,
      totalPages: Math.ceil(totalResults / PAGE_SIZE),
    }, {
      status: 200
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: `Failed to fetch posts for user`,
      errorMessage: error.message,
      error: error
    }, {
      status: 500
    })
  }
}