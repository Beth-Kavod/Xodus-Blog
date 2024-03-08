import "@/assets/css/output.css";
import Link from "next/link";
import User from "@/types/User";
import VideoLinkSchema from '@/types/VideoLinkSchema'

interface PreviewPost {
    title: string;
    content: string;
    author: User;
    _id: string;
    imageUrls: Array<string>;
    videoLinks: Array<VideoLinkSchema>;
    createdAt: Date;
    voteCount: number;
}

function Post(props: PreviewPost): JSX.Element {
    const { author, createdAt, content, voteCount, _id, title, imageUrls, videoLinks } = props

    return (
        <div className="w-full h-fit">
            <p>{voteCount}</p>
            <div className="w-full flex justify-between items-center px-8 py-4">
                <Link
                    href={"/posts/" + _id}
                    title="View post"
                    className="text-xl text-light-theme-green hover:text-light-theme-green-active transition-all overflow-x-hidden overflow-ellipsis whitespace-nowrap"
                >
                    {title}
                </Link>
                <p className="text-sm text-light-theme-green">
                    <Link href={"/accounts/profile/" + author.username} title={`View ${author.username}'s profile`}>
                        {author.username} 
                    </Link>
                    <span className="text-xs px-1 font-light text-black">
                        {createdAt ? createdAt.toLocaleDateString() : ""}
                    </span>
                </p>
            </div>
            <div className="flex w-full items-center justify-between px-8 pb-4">
                <p className="text-sm font-light whitespace-nowrap overflow-x-hidden overflow-ellipsis">
                    {content}
                </p>
                <p className="text-xs font-light shrink-0 w-fit">
                    {imageUrls.length || videoLinks.length ? `${imageUrls.length + videoLinks.length} attachments...` : ""}
                </p>
            </div>
        </div>
    );
}

export default Post;
