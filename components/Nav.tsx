"use client"
import "@/assets/css/output.css";
import Link from "next/link";
import { useRouter }  from 'next/navigation'
import { useState, useEffect } from "react";
import { useUser } from '@/components/UserContext'

function Navbar() {
    const [search, setSearch] = useState<string>("");
    const router = useRouter();
    const { user, logout } = useUser()

    const handleSubmit = (event: any) => {
        event.prevent.default()
        router.push(`/posts/search=${search}`);
    };

    const handleInputChange = (event: any) => {
        const query = event.target.value;
        setSearch(query);
    };

    const viewProfile = () => {
        const url = `/accounts/profile/${user.username}`;
        router.push(url);
    };

    const toHome = () => {
        router.push("/")
    };

    return (
        <nav className="h-fit w-full border shadow-sm border-b-light-border flex items-center justify-center">
            <button
                onClick={toHome}
                className="text-xl w-fit h-full p-4 hover:bg-light-border transition-all"
            >
                <span className="font-bold">Xodus</span>
            </button>

            <Link
                href={user ? "/posts/create" : "/accounts/login"}
                className="text-sm mx-2 px-3 py-1.5 rounded-lg text-light-theme-green hover:bg-green-100 hover:text-light-theme-green-active"
            >
                New Post
            </Link>

            <form onSubmit={(event) => handleSubmit(event)} className="w-1/2">
                <input
                    type="text"
                    name="search"
                    onChange={handleInputChange}
                    disabled={true}
                    // ! While search is unavailable
                    placeholder="search temporarily unavailable"
                    // placeholder="Search..."
                    className="outline-none px-2 py-1.5 text-sm w-full rounded-md border-0 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-light-theme-green"
                />
                <button type="submit" className="hidden"></button>
            </form>

            <div className="px-4 text-md">
                {user.username ? (
                    <div className="flex items-center">
                        <h1
                            onClick={viewProfile}
                            title="View profile"
                            className="hover:underline hover:underline-offset-2 transition-all"
                        >
                            {user.username}
                        </h1>
                        <button onClick={() => logout()} className="mx-2 px-3 py-1.5 text-sm text-red-500 hover:bg-red-100 rounded-lg" title="Logout">
                            Logout
                        </button>
                    </div>
                ) : (
                    <Link
                        href="/accounts/login"
                        className="hover:underline hover:underline-offset-2 transition-all"
                    >
                        Login
                    </Link>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
