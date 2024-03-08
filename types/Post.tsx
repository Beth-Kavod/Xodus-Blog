import CommentType from './Comment'

interface Post {
  title: string;
  content: string;
  author: string;
  date: Date | null;
  imageUrls: Array<string>;
  voteCount: number;
  comments: Array<CommentType> | string,
  _id: string;
}

export default Post