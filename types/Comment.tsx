import User from './User'

interface Comment {
  author: User;
  content: string;
  // votes: Array<{ author: string, vote: boolean, date: Date}>;
  voteCount: number;
  createdAt: Date;
  postID: string;
  _id: string;
}

export default Comment