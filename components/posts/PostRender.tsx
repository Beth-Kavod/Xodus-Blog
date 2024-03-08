"use client"
import { useState, useEffect, Suspense } from 'react'
// import { useRouter } from 'next/navigation'
import Post from '@/types/Post'
import dynamic from 'next/dynamic';

const PostList  = dynamic(() => import('./PostList'), { suspense: true })

/* interface Post {
  title: string;
  content: string;
  author: string;
  date: Date;
  _id: string;
  comments: Array<string>;
  votes: Array<{ author: string, vote: boolean, date: Date }>;
  imageUrls: Array<string>;
} */

interface Data {
  search: string;
  totalPages: number;
  totalPosts: number;
  message: string;
}

export default function PostRender() {
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10)
  const [pageCount, setPageCount] = useState<number>(0)
  const [data, setData] = useState<Data>({ search: "", totalPages: pageCount, totalPosts: 0, message: ""})
  const [posts, setPosts] = useState<Post[]>([]);
  /* const [search, setSearch] = useState<string>("")        
  const searchTerms = search.split(" ").join(", ") */
  /* const router = useRouter()
  
  useEffect(() => {
    const { query } = router
    setSearch(query ? query.search?.toString() || "" : "")
    console.log(router)
  }, [router]) */
  /* console.log(search)
  console.log(searchTerms) */
  // ! TEMPORARY FIX TO REMOVE ERROR WITH useSearchParams()
  // searching posts is unavailable
  const search = ""
  const searchTerms = ""

  useEffect(() => {
    const queryString = `?page=${page}&query=${search}&size=${size}`

    try {
      fetch(`/api/posts/search${queryString}`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data)
          if (!data.data) return
          data.data.forEach((post: Post) => (post.createdAt = new Date(post.createdAt)));
          setPosts(data.data);
          setPageCount(data.totalPages);
          setData(data)
        });
    } catch (err) {
      console.error(err);
    }
  }, [search, page, size])

  return (
    <div className="w-full flex flex-col items-center justify-center">
      {/* <Suspense fallback={<div>Loading...</div>}> */}
        { posts.length ? <PostList posts={posts} data={data} searchTerms={searchTerms} /> : <div>Loading...</div>}
      {/* </Suspense> */}

      {/* I might make this a component */}
      <div className="flex justify-between items-center text-sm w-2/3 border-x border-t border-x-light-border">
        <div className="w-fit text-xs px-5 py-3 flex items-center">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page <= 1}
            className={`px-2 h-6 mx-1 border rounded-md border-light-border ${page <= 1 ? 'bg-gray-400 text-gray-600 cursor-not-allowed' : 'hover:bg-light-theme-green hover:text-white'}`}
          >
            Previous page
          </button>

          <p className="px-2">
            {page}
              /
            {pageCount}
          </p>

          <button
            onClick={() => setPage(page + 1)}
            disabled={page >= pageCount}
            className={`px-2 h-6 mx-1 border rounded-md border-light-border ${page >= pageCount ? 'bg-gray-400 text-gray-600 cursor-not-allowed' : 'hover:bg-light-theme-green hover:text-white'}`}
          >
            Next page
          </button>
        </div>

        <div className="text-xs px-5">
          <button onClick={() => setSize(10)} className={size == 10 ? `w-6 h-6 mx-1 border rounded-md border-light-border bg-light-theme-green text-white` : `w-6 h-6 mx-1 border rounded-md border-light-border`}> 10 </button>
          <button onClick={() => setSize(15)} className={size == 15 ? `w-6 h-6 mx-1 border rounded-md border-light-border bg-light-theme-green text-white` : `w-6 h-6 mx-1 border rounded-md border-light-border`}> 15 </button>
          <button onClick={() => setSize(25)} className={size == 25 ? `w-6 h-6 mx-1 border rounded-md border-light-border bg-light-theme-green text-white` : `w-6 h-6 mx-1 border rounded-md border-light-border`}> 25 </button>
        </div>
      </div>
    </div>
  )
}