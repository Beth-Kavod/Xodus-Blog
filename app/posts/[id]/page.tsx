"use client"
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CommentList from "@/components/CommentList";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link'
import Voting from "@/components/Voting";
import LoginError from "@/components/LoginError";
import Image from 'next/image'
import { useUser } from '@/components/UserContext'
import { Suspense } from "react";

interface Post {
    title: string;
    content: string;
    author: string;
    date: Date | null;
    imageUrl: string;
    _id: string;
}

function PostPage(): JSX.Element {
    const [voteCount, setVoteCount] = useState<number | null>(null); // Initialize voteCount stat
    const [error, setError] = useState<string | null>(null);
    const [post, setPost] = useState<Post>({title: "", content: "", author: "", date: null, imageUrl: "", _id: ""});
    const [editing, setEditing] = useState<boolean>(false);
    const router = useRouter()
    const pathname = usePathname()
    const id = pathname.split("/").pop();
    const { user } = useUser()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`/api/posts/get-post/${id}`);
                // ! FIX THIS TO SEND NO POST TO CLIENT, PAGE WILL LOAD INDEFINITELY
                if (res.status === 404) {
                    throw new Error("No post found");
                }
                const data = await res.json();
                setPost(data.data as Post);
                setVoteCount(data.voteCount)
            } catch (err) {
                console.error(err);
            }
        };
        fetchData(); // Call the async function inside the effect
    }, []);

    const addVote = async (isUpvote: boolean) => {
        if (!user.id) {
            setError("You must be signed in to vote.");
            return;
        }

        try {
            let res = await fetch(`/api/votes/post/${id}?userID=${user.id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    date: new Date(),
                    author: user.username,
                    vote: isUpvote,
                }),
            });
            let data = await res.json();
            setVoteCount(data.voteCount)
        } catch (err) {
            console.error(err);
        }
    };

    const deletePost = async () => {
        try {
            await fetch(
                `/api/posts/delete-post/${id}?userID=${user.id}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            router.push("/")
        } catch (err) {
            console.error(err);
        }
    };

    const editPost = async () => {
        try {
            await fetch(
                `/api/posts/edit-post/${id}?userID=${user.id}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(post),
                }
            );

            setEditing(!editing);
        } catch (err) {
            console.error(err);
        }
    };

    const updateContent = (e: any) => {
        const newContent: string = e.target.value || "";
        setPost({ ...post, content: newContent });
    };

    const renderDeleteButton = () => {
        if (post) {
            if (
                user.username === post.author
            ) {
                return (
                    <button
                        onClick={deletePost}
                        className="text-red-600 transition-all hover:bg-red-200 text-sm px-2 py-1 my-1.5 rounded-lg"
                    >
                        Delete Post
                    </button>
                );
            } else {
                return "";
            }
        }
        return "";
    };

    const renderEditButton = () => {
        if (post) {
            if (
                user.username === post.author
            ) {
                return (
                    <button
                        onClick={() => {
                            setEditing(!editing);
                        }}
                        className="text-green-600 transition-all hover:bg-green-200 text-sm px-2 py-1 rounded-lg"
                    >
                        Edit Post
                    </button>
                );
            } else {
                return "";
            }
        }
        return "";
    };

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div>
                <Nav />
                <div className="w-full flex justify-center">
                    <div className="h-fit min-h-screen w-2/3 border-x border-light-border">
                        <div className="w-full">
                            <div className="flex items-center">
                                {error && (
                                    <LoginError
                                        styles={"mx-32"}
                                        message={error}
                                        onClose={() => setError(null)}
                                    />
                                )}
                                <Voting
                                    voteCount={voteCount || 0}
                                    addVote={addVote}
                                    removeVote={addVote}
                                />
                                <h1 className="p-20 px-10 text-4xl">
                                    {post ? post.title : "Loading..."}
                                </h1>
                                <div className="w-fit px-5 ml-auto flex flex-col items-center justify-center">
                                    {renderEditButton()}
                                    {renderDeleteButton()}
                                </div>
                            </div>
                            <div className="flex items-center justify-between border-b border-light-border">
                                <Link
                                    href={"/accounts/profile/" + post?.author}
                                    title={"View " + post?.author + "'s profile"}
                                    className="p-20 py-5 text-md text-light-theme-green"
                                >
                                    {post ? post.author : "Loading..."}
                                </Link>
                            </div>
                        </div>

                        {post ? (
                            post.imageUrl ? (
                                <Image alt={post.imageUrl} src={post.imageUrl} className="w-full p-10" />
                            ) : (
                                ""
                            )
                        ) : (
                            ""
                        )}

                        <div className="flex items-center justify-center w-full h-fit my-10">
                            {editing ? (
                                <>
                                    <textarea
                                        onChange={updateContent}
                                        className="p-2 border border-light-border h-[500px] w-5/6 resize-none text-lg whitespace-pre-line"
                                        value={post ? post.content : "Loading"}
                                    />
                                    <button
                                        onClick={editPost}
                                        className="text-sm px-2 py-1 mx-2 rounded-lg text-green-600 hover:bg-green-200 transition-all"
                                    >
                                        Edit Post
                                    </button>
                                </>
                            ) : (
                                <p className="p-2 w-5/6 text-lg whitespace-pre-line">
                                    {post ? post.content : "Loading..."}
                                </p>
                            )}
                        </div>
                        <CommentList id={post ? post._id : ""} />
                    </div>
                </div>
                <Footer />
            </div>
        </Suspense>
    );
}

export default PostPage;
