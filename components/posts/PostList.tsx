"use client"
import "@/assets/css/output.css"
import Post from "./Post";


interface Post {
    title: string;
    content: string;
    author: string;
    date: Date;
    _id: string;
    votes: Array<{ author: string, vote: boolean, date: Date }>;
    imageUrls: Array<string>;
}

interface Data {
    search: string;
    totalPages: number;
    totalPosts: number;
    message: string;
}

interface Props {
    posts: Post[];
    data: Data;
    searchTerms: string;
}

function PostList (props: Props): JSX.Element {
    return (
        <div className="h-fit min-h-screen w-2/3 border-x border-light-border divide-y divide-light-border">
            <div className="w-full">
                <h1 className="text-2xl p-8"> {props.searchTerms ? `Search terms: ${props.searchTerms}` : "All Posts"} </h1>
                <p className="px-8 pb-4 font-light"> {props.data.totalPosts} Posts </p>
            </div>
            {/* Message for the user */}
            {props.data.totalPosts ? "" : props.data.message}
            {props.posts.map(post => (
                <Post id={post._id} key={post._id} imageUrls={post.imageUrls} author={post.author.username} title={post.title} content={post.content} votes={post.votes} date={post.date} />
            ))}

        </div>
    );
}

export default PostList;
