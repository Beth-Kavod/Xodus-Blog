"use client"
import "@/assets/css/output.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Post from "@/components/posts/Post";
import Link from 'next/link'
import Image from 'next/image'
import { useUser } from '@/components/UserContext'
import { Suspense } from "react";

interface User {
    username: string;
    userAuthId: string;
    _id: string;
    email: string;
    admin: boolean;
    avatar: string;
}

const defaultUser = {
    username: "",
    avatar: "",
    admin: false,
    email: "",
    userAuthId: "",
    _id: ""
}

interface Post {
    title: string;
    content: string;
    author: string;
    date: Date;
    _id: string;
    imageUrl: string;
}

function ProfilePage(): JSX.Element {
    const { user } = useUser()
    const [posts, setPosts] = useState<Post[]>([]);
    const [page, setPage] = useState<number>(1);
    const [pageCount, setPageCount] = useState<number>(5);
    const [totalPosts, setTotalPosts] = useState<number>(0);
    const [size, setSize] = useState<number>(10)
    const [avatar, setAvatar] = useState<string>("");
    const pathname = usePathname()
    const username = pathname.split("/").pop();
    const [userProfile, setUserProfile] = useState<User>({...defaultUser} as User);

    let isSelf = user.username === username ? true : false

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Get user from mongo-db
                const userResponse = await fetch(`/api/users/profile/${username}?userID=${user.id}`);
                const userData = await userResponse.json();
                
                // Make 404 error page
                if (userResponse.status === 404) {
                    console.log(userData.message)
                    return false
                }

                setUserProfile(userData.data as User);

                // Get users' posts from mongo-db
                const postsResponse = await fetch(`/api/posts/user/${username}?size=${size}&page=${page}`);
                const postData = await postsResponse.json();

                setPageCount(postData.totalPages)
                setTotalPosts(postData.totalPosts)

                // Fix dates from MongoDB date to JS date object
                const postsWithDates: Post[] = postData.data.map((post: Post) => ({
                    ...post,
                    date: new Date(post.date),
                }));
                setPosts(postsWithDates as Post[]);
            } catch (err) {
                console.error(err);
            }
        };

        fetchData();
    }, [user.id, page, size, username]);

    // Update the users avatar display every time the user object is updated
    useEffect(() => setAvatar(userProfile ? userProfile.avatar : ""), [userProfile]);

    const updateAvatar = async (event: any) => {
        const imageFile = event.target.files[0];
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("upload_preset", "Avatars");

        const response = await fetch(`/api/users/update-avatar?userID=${user.id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: user.username, image: formData }),
        });

        const responseData = await response.json();

        // Ensure success
        if (responseData.success) {
            const url = responseData.data;
            setAvatar(url);
        } else {
            console.error("Image response or user does not exist.");
        }
    };

    return (
        // <Suspense fallback={<div>Loading...</div>}>
            <div className="h-screen">
                <Nav />
                <div className="w-full flex justify-center">
                    <div className="h-fit min-h-screen w-2/3 border-x border-light-border">
                        {/* Render the users profile information */}
                        <div className="w-full h-fit p-10 flex items-center">
                            <div className="flex flex-col w-1/6">
                                <Image
                                    src={
                                        userProfile?.avatar
                                            ? avatar
                                            : "https://p7.hiclipart.com/preview/355/848/997/computer-icons-user-profile-google-account-photos-icon-account-thumbnail.jpg"
                                    }
                                    width={84}
                                    height={84}
                                    alt="User avatar"
                                    className="w-40 h-40 shadow-gray-400 shadow-sm rounded-md"
                                />
                                {isSelf ? (
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="text-xs py-3"
                                        onChange={updateAvatar}
                                    />
                                ) : (
                                    ""
                                )}
                            </div>
                            <h1 className="text-2xl px-10">
                                {user ? user.username : "Loading"}
                                <span className="text-xs">
                                    <br />
                                    {user
                                        ? userProfile._id
                                            ? ` #${userProfile._id}`
                                            : ""
                                        : ""}
                                </span>
                                <br />
                                <span className="text-sm">
                                    {userProfile ? userProfile.email : "Loading"}
                                </span>
                            </h1>
                        </div>

                        {/* Render the users posts */}
                        <h1 className="text-2xl p-8"> {user?.username}&#39;s Posts </h1>
                        <p className="px-8 pb-4 font-light"> {totalPosts} Posts </p>
                        <div className="divide-y divide-light-border border-y border-light-border">
                            {posts.map((post) => (
                                <div className="w-full h-fit" key={post._id}>
                                    <div className="w-full flex justify-between items-center px-8 py-4">
                                        <Link
                                            href={"/posts/" + post._id}
                                            title="View post"
                                            className="text-xl text-light-theme-green hover:text-light-theme-green-active transition-all"
                                        >
                                            {post.title}
                                        </Link>
                                        <span className="text-xs px-1 font-light text-black">
                                            {post.date.toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex w-full items-center justify-between px-8 pb-4">
                                        <p className="text-sm font-light whitespace-nowrap overflow-x-hidden overflow-ellipsis">
                                            {post.content}
                                        </p>
                                        <p className="text-xs font-light shrink-0 w-fit">
                                            {post.imageUrl ? "1 attachment..." : ""}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="w-full flex flex-col items-center justify-center">
                            <div className="flex justify-between items-center text-sm w-full">
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
                    </div>
                </div>
                <Footer />
            </div>
        // </Suspense>
    );
}

export default ProfilePage;
