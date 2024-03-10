"use client"
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CommentList from "@/components/CommentList";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link'
import Voting from "@/components/Voting";
import ErrorMessage from "@/components/ErrorMessage";
import Image from 'next/image'
import { useUser } from '@/components/UserContext'
import CarouselDisplayImages from "@/components/carousel/CarouselDisplayImages";

import PostType from "@/types/Post";
import CommentType from "@/types/Comment";

function PostPage(): JSX.Element {
    const { user } = useUser()
    const [error, setError] = useState<string | null>(null);
    const [post, setPost] = useState<PostType>({ 
        title: "", 
        content: "", 
        author: {
            username: user.username,
            id: user.id
        }, 
        imageUrls: [], 
        _id: "", 
        voteCount: 0, 
        videoLinks: [],
        tags: [],
        comments: [] as CommentType[],
        createdAt: new Date() 
    });

    const [editing, setEditing] = useState<boolean>(false);
    
    const router = useRouter()
    const pathname = usePathname()
    const id = pathname.split("/").pop();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const postResponse = await fetch(`/api/posts/${id}`);
                // ! FIX THIS TO SEND NO POST TO CLIENT, PAGE WILL LOAD INDEFINITELY
                if (postResponse.status === 404) {
                    throw new Error("No post found");
                }
                const postData = await postResponse.json();
                const { title, content, author, imageUrls, _id, voteCount, videoLinks, comments, tags } = postData.data
                const { createdAt } = postData
                setPost(() => ({
                    _id, 
                    title, 
                    content, 
                    author,  
                    voteCount, 
                    comments,
                    videoLinks,
                    imageUrls, 
                    createdAt,
                    tags
                }));
            } catch (err) {
                console.error(err);
            }
        };
        fetchData(); // Call the async function inside the effect
    }, [id]);

    const addVote = async (isUpvote: boolean) => {
        alert("voting temporally disabled")
        return
        if (!user.id) {
            setError("You must be signed in to vote.");
            return;
        }

        try {
            const res = await fetch(`/api/votes/post/${id}?userID=${user.id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user: user.id,
                    vote: isUpvote,
                }),
            });

            const data = await res.json();

            if (!data.success) {
                setError(data.errorMessage)
                return 
            }
            
            setPost(prev => ({
                ...prev,
                voteCount: data.voteCount
            }));
        } catch (err) {
            console.error(err);
        }
    };

    const deletePost = async () => {
        try {
            const deletePost = await fetch(`/api/posts/${id}/delete-post?userID=${user.id}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const response = await deletePost.json()
            if (response.success) {
                router.push("/")
            } else {
                setError(response.errorMessage)
            }

        } catch (err) {
            console.error(err);
        }
    };

    const editPost = async () => {
        try {
            await fetch(
                `/api/posts/${id}/edit-post?userID=${user.id}`,
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

    // ! Fix to actually update content on the backend
    const updateContent = (e: any) => {
        const newContent: string = e.target.value || "";
        setPost({ ...post, content: newContent });
    };

    const renderDeleteButton = () => {
        if (post) {
            if (
                user.username === post.author.username
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
                user.username === post.author.username
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
        // <Suspense fallback={<div>Loading...</div>}>
            <div>
                <Nav />
                <div className="w-full flex justify-center">
                    <div className="h-fit min-h-screen w-2/3 border-x border-light-border">
                        <div className="w-full">
                            <div className="flex items-center">
                                {error && (
                                    <ErrorMessage
                                        styles={"mx-32"}
                                        message={error}
                                        onClose={() => setError(null)}
                                    />
                                )}
                                <Voting
                                    voteCount={post.voteCount || 0}
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
                                    href={"/accounts/profile/" + post?.author.username}
                                    title={"View " + post?.author.username + "'s profile"}
                                    className="p-20 py-5 text-md text-light-theme-green"
                                >
                                    {post ? post.author.username : "Loading..."}
                                </Link>
                            </div>
                        </div>

                        {post ? (
                            post.imageUrls.length ? (
                                <CarouselDisplayImages images={post.imageUrls} />
                            ) : (
                                ""
                            )
                        ) : (
                            ""
                        )}

                        {
                            post.videoLinks.length ? (
                                post.videoLinks.map(videoLink => {
                                    return (
                                        <>
                                            <p>{videoLink.name}</p>
                                            <Link href={videoLink.link} target="_blank" />
                                        </>
                                    )
                                })
                            ) : ""
                        }

                        <div className="flex items-center justify-center w-full h-fit my-10">
                            {/* Make separate page at some point */}
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
                        <CommentList comments={post.comments as CommentType[]} id={post._id} />
                    </div>
                </div>
                <Footer />
            </div>
        // </Suspense>
    );
}

export default PostPage;
