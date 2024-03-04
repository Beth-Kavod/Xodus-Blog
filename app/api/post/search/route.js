import { NextResponse } from 'next/server'

import { getUserWithID } from '@/utils/routeMethods.js'

/* ----------------------------- MongoDB Schemas ---------------------------- */

import Post from '@/models/Post'

/* -------------------------------------------------------------------------- */

/* ------------------- Search posts with title and content ------------------ */

export const GET = async (request) => {
  const searchParams = request.nextUrl.searchParams
  const page = parseInt(searchParams.get("page")) || 1
  const PAGE_SIZE = parseInt(searchParams.get("size"));

  let query = searchParams.get("query") || ""
  const keywords = query.split(/\s+/); // Split the query at space characters

  const regexArray = keywords.map(keyword => new RegExp(keyword, 'i'));

  const searchQuery = {
    $and: [
      {
        $or: [
          { title: { $in: regexArray } },
          { content: { $in: regexArray } },
          { author: { $in: regexArray } }
        ]
      }
    ]
  };

  try {
    const totalResults = await Post.countDocuments(searchQuery);

    const results = await Post
      .find(searchQuery)
      .skip((page - 1) * PAGE_SIZE)
      .sort({ createdAt: -1 })
      .limit(PAGE_SIZE);

    let message =
      results.length === 0
        ? "No posts found from search"
        : "Search results successfully fetched";

    return NextResponse.json({
      success: true,
      message: message,
      count: results.length,
      currentPage: page,
      totalPosts: totalResults,
      totalPages: Math.ceil(totalResults / PAGE_SIZE),
      data: results
    }, {
      status: 200
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: `Failed to search posts`,
      errorMessage: error.message,
      error: error
    }, {
      status: 500
    })
  }
}