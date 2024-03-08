import "@/assets/css/output.css";
import Link from "next/link";
import Post from "@/types/Post";

function Post(props: Post): JSX.Element {
    return (
        <div className="w-full h-fit">
            <p>{props.voteCount}</p>
            <div className="w-full flex justify-between items-center px-8 py-4">
                <Link
                    href={"/posts/" + props._id}
                    title="View post"
                    className="text-xl text-light-theme-green hover:text-light-theme-green-active transition-all overflow-x-hidden overflow-ellipsis whitespace-nowrap"
                >
                    {props.title}
                </Link>
                <p className="text-sm text-light-theme-green">
                    <Link href={"/accounts/profile/" + props.author} title={`View ${props.author}'s profile`}>
                        {props.author.username} 
                    </Link>
                    <span className="text-xs px-1 font-light text-black">
                        {props.createdAt ? props.createdAt.toLocaleDateString() : ""}
                    </span>
                </p>
            </div>
            <div className="flex w-full items-center justify-between px-8 pb-4">
                <p className="text-sm font-light whitespace-nowrap overflow-x-hidden overflow-ellipsis">
                    {props.content}
                </p>
                <p className="text-xs font-light shrink-0 w-fit">
                    {props.imageUrls.length ? `${props.imageUrls.length} attachments...` : ""}
                </p>
            </div>
        </div>
    );
}

export default Post;
