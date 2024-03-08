"use client"
import "@/assets/css/output.css"
import Comment from "./Comment";
import CreateComment from "./CreateComment";

// types
import CommentType from "@/types/Comment";

interface Props {
    comments: Array<CommentType>;
    id: string;
}

function CommentList(props: Props): JSX.Element {
    const { comments, id } = props

    return (
        <div className="border-t border-light-border py-4">
            <h1 className="text-3xl px-20 py-8 w-full">
                {comments.length} Responses
            </h1>
            <div className="w-full divide-y divide-light-border">
                {
                    comments.map((cmt: CommentType) => (
                        <Comment comment={cmt} key={cmt._id}/>
                    ))
                }

            </div>
            <CreateComment postID={id}/>
        </div>
    );
}

export default CommentList;
