"use client"
import { useState, useEffect, lazy, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

const PostList  = lazy(() => import('./PostList'))

interface Post {
  title: string;
  content: string;
  author: string;
  date: Date;
  _id: string;
  votes: Array<{ author: string, vote: boolean, date: Date }>;
  imageUrl: string;
}

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
  
  const searchParams = useSearchParams()
  const search = searchParams.get("search") || ""
  const searchTerms = search?.split(" ").join(", ")

  useEffect(() => {
    const queryString = `?page=${page}&query=${search}&size=${size}`

    try {
      fetch(`/api/posts/search${queryString}`)
        .then((res) => res.json())
        .then((data) => {
          data.data.forEach((post: Post) => (post.date = new Date(post.date)));
          setPosts(data.data);
          setPageCount(data.totalPages);
          setData(data)
          console.log(data)
        });
    } catch (err) {
      console.error(err);
    }
  }, [search, page, size])

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <Suspense fallback={<div>Loading...</div>}>
        <PostList posts={posts} data={data} searchTerms={searchTerms} />
      </Suspense>

      <div className="flex justify-between items-center text-sm w-2/3 border-x border-t border-x-light-border">
        <div className="w-fit text-xs px-5 py-3 flex items-center">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page <= 1}
            className="px-2 h-6 mx-1 border rounded-md border-light-border hover:bg-light-theme-green hover:text-white"
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
            className="px-2 h-6 mx-1 border rounded-md border-light-border hover:bg-light-theme-green hover:text-white"
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
