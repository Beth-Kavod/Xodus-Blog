"use client"
import "@/assets/css/output.css";
import { useState } from "react";
import Link from 'next/link'
import Voting from "./Voting";
import ErrorMessage from "./ErrorMessage";
import { useUser } from '@/components/UserContext';
import { useRouter } from 'next/navigation'
import CommentType from '@/types/Comment'

import EditComment from "./EditComment"

interface Props {
    comment: CommentType;
}

function Comment(props: Props): JSX.Element {
    const [isEditing, setIsEditing] = useState(false)
    const [error, setError] = useState<String | null>(null);
    const { comment } = props
    const { voteCount } = comment
    const { user } = useUser()
    const router = useRouter()

    const deleteComment = async () => {
        try {
            await fetch(
                `/api/comments/delete/${props.comment._id}?userID=${user.id}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            // window.location.href = window.location.href;
        } catch (err) {
            console.error(err);
        }
    };

    const addVote = async (isUpvote: boolean) => {
        if (!user.id) {
            setError("You must be logged in to vote.");
            return;
        }
        try {
            let res = await fetch(`/api/votes/comment/${comment._id}?userID=${user.id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    date: new Date(),
                    author: user.username,
                    vote: isUpvote,
                })
            });
            let data = await res.json()
            // set
        } catch (err) {
            console.error(err);
        }
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
    };
    

    return (
        <div className="px-16 py-4 flex w-full items-center justify-center">
            {error && (
                <ErrorMessage
                    styles={""}
                    message={error}
                    onClose={() => setError(null)}
                />
            )}
            <Voting voteCount={voteCount || 0 } addVote={addVote} removeVote={addVote} />
            
            <div className="w-full">
                <div className="flex text-xs items-center justify-between">
                    <Link href={"/accounts/profile/" + comment.author} title={"View " + comment.author + "'s profile"}  className="text-light-theme-green py-2">
                        {" "}{comment.author} {new Date(comment.date).toLocaleDateString()}-{new Date(comment.date).toLocaleTimeString()}{" "}
                    </Link>
                    {isEditing ? ( // Conditional rendering based on isEditing state
                        <EditComment
                            commentData={comment}
                            postID={comment.postID}
                            commentID={comment._id}
                            userId={user.id || ""}
                            onCancel={handleCancelEdit}
                        />
                    ) : (
                        <div>
                            { user.username === comment.author &&
                                <div>
                                <button
                                    onClick={handleEditClick}
                                    className="text-green-600 transition-all hover:bg-green-200 px-2 py-1 rounded-lg mr-2"
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={deleteComment}
                                    className="text-red-600 transition-all hover:bg-red-200 px-2 py-1 rounded-lg ml-2"
                                >
                                    Delete
                                </button>
                            </div>}
                        </div>
                    )}
                </div>
                {isEditing ? "" : <p className="text-md"> {comment.content} </p> }
            </div>
        </div>
    );
}


export default Comment;
