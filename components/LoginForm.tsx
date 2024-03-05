"use client"
import "@/assets/css/output.css";
import Link from "next/link";
import { useState, useMemo } from "react";
import LoginError from "./LoginError";
import { useRouter } from 'next/navigation'
import { useUser } from '@/components/UserContext'

function LoginForm() {
    const [username, setUsername] = useState<String>("");
    const [password, setPassword] = useState<String>("");
    const [error, setError] = useState<String | null>(null);
    const { login } = useUser()
    const router = useRouter()

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            const response = await fetch("/api/users/verify", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            const responseData = await response.json();

            if (responseData.success) {
                login({
                    username: responseData.data.username,
                    id: responseData.data.userAuthId,
                })
                router.push("/");
            } else if (responseData.errorMessage) {
                setError(responseData.errorMessage);
            } else {
                setError("Something went wrong, please try again")
            }
        } catch (err) {
            console.error(err);
        }
    };

    const isDisabled = useMemo(() => {
        return username.length < 3 || password.length < 3;
    }, [username, password])

    return (
        <div className="h-full flex flex-col items-center justify-center px-6 py-12 lg:px-8">
            {error && (
                <LoginError
                    styles=""
                    message={error}
                    onClose={() => setError(null)}
                />
            )}
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Sign in to your account
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium leading-6 text-gray-900">
                            Username
                        </label>
                        <div className="mt-2">
                            <input
                                onChange={(e) => setUsername(e.target.value)}
                                name="username"
                                type="text"
                                required
                                className="outline-none p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-light-theme-green sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label className="block text-sm font-medium leading-6 text-gray-900">
                                Password
                            </label>
                        </div>
                        <div className="mt-2">
                            <input
                                onChange={(e) => setPassword(e.target.value)}
                                name="password"
                                type="password"
                                required
                                className="outline-none p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-light-theme-green sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isDisabled}
                            className={isDisabled == true ? 
                            "flex w-full justify-center rounded-md bg-light-theme-green px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:bg-light-theme-green hover:bg-light-theme-green-active transition-all opacity-25" : 
                            "flex w-full justify-center rounded-md bg-light-theme-green px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:bg-light-theme-green hover:bg-light-theme-green-active transition-all"
                        }
                        >
                            Sign in
                        </button>
                    </div>
                </form>

                <p className="mt-10 text-center text-sm text-gray-500">
                    Don&#39;t have an account?
                    <Link
                        href="/accounts/create"
                        className="font-semibold leading-6 text-light-theme-green ml-3 hover:text-light-theme-green-active transition-all"
                    >
                        Create One!
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default LoginForm;
