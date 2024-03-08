import CommentType from './Comment'
import VideoLinkSchema from './VideoLinkSchema'

interface Post {
  title: string;
  content: string;
  author: string;
  imageUrls: Array<string>;
  videoLinks: Array<VideoLinkSchema>;
  voteCount: number;
  comments: Array<CommentType> | string,
  createdAt: Date;
  tags: Array<string>,
  _id: string;
}

export default Post