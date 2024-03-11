"use client"
import { SyntheticEvent, useState } from "react";
import { useRouter } from 'next/navigation'
import { useUser } from '@/components/UserContext'

interface CommentObject {
    author: String;
    content: String;
}

interface Props {
    postID: String;
}


export default function CreateComment (props: Props): JSX.Element {
    const router = useRouter()
    const { user } = useUser();
    const author = user ? user.username : "";

    const [comment, setComment] = useState<CommentObject>({ author, content: ""});

    const handleSubmit = async (event: SyntheticEvent): Promise<void> => {
        event.preventDefault();
        
        if (!author) router.push("/accounts/login") 

        try {
            await fetch(`/api/comments/${props.postID}/create`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(comment)
            })

            router.push(`/posts/${props.postID}`)
        } catch (err) {
            console.error(err);
        }
    }

    const handleInputChange = (event: any) => {
        const { name, value } = event.target;
        setComment({ ...comment, [name]: value })
    };

    const textareaStyles: any = {
        height: "400px",
        resize: "none"
    }

    return (
        <form onSubmit={handleSubmit} className="w-3/4 mx-auto h-fit pb-12">
            <div className="h-fit w-full my-5 rounded-md p-6 border border-light-border">
                <h1 className="text-lg py-2"> Post Comment </h1>
                <p className="text-xs"> Write comment here: </p>
                <textarea onChange={handleInputChange} style={textareaStyles} className="text-sm w-full my-2 px-2 py-1 border border-light-border rounded-md outline-none focus:ring-1 focus:ring-green-500 resize-none" name="content" placeholder="eg. I love this post" required />
                <button type="submit" className="bg-light-theme-green text-white rounded-lg px-4 py-1.5 hover:bg-light-theme-green-active"> Create Comment </button>
            </div>
        </form>
    )
}
