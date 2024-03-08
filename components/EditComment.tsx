"use client"
import { SyntheticEvent, useState } from "react";
import { useRouter } from 'next/navigation'
import { useUser } from "./UserContext";

import User from "@/types/User"

interface CommentObject {
    author: User;
    content: string;
}

interface Props {
    postID: String;
    commentData: CommentObject;
    commentID: String;
    userId: String | null;
    onCancel: Function
}

function CreateComment(props: Props): JSX.Element {
    const router = useRouter()
    const { user } = useUser()

    const [comment, setComment] = useState<CommentObject>({
        author: user,
        content: props.commentData.content, // Use props.commentData.content as initial content
    });

    const handleCancelClick = () => {
        props.onCancel();
    };

    const handleSubmit = async (event: SyntheticEvent): Promise<void> => {
        event.preventDefault();

        if (localStorage.getItem("user") == null) {
            window.location.href = "/accounts/login";
            return;
        }

        try {
            await fetch(`/api/comments/edit/${props.commentID}?userID=${props.userId}`, {
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

    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setComment({ ...comment, [name]: value });
    };

    return (
        <form onSubmit={handleSubmit} className="w-3/4 mx-auto pb-6">
        <textarea
            onChange={handleInputChange}
            value={comment.content}
            className="h-24 text-sm w-full my-2 px-2 py-1 border border-light-border rounded-md outline-none focus:ring-1 focus:ring-green-500 resize-none"
            name="content"
            placeholder="eg. Your opinion is objectively bad"
            required
        />
        <button
          type="button"
          onClick={handleCancelClick} // Call the onCancel function when the "Cancel" button is clicked
          className="bg-red-500 text-white rounded-lg px-2 py-1.5 hover:bg-red-600"
        >
          Cancel
        </button>
        <button
            type="submit"
            className="bg-light-theme-green text-white rounded-lg px-2 py-1.5 hover:bg-light-theme-green-active"
        >
            Save Comment
        </button>
    </form>
    
    
    );
}

export default CreateComment;
