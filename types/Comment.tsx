interface Comment {
  author: string;
  content: string;
  votes: Array<{ author: string, vote: boolean, date: Date}>;
  voteCount: number;
  date: Date;
  postID: string;
  _id: string;
}

export default Comment