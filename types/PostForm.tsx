interface PostForm {
  title: string,
  content: string,
  author: string,
  date: Date,
  addresses: Array<string>;
  imageUrls: Array<string>
}

export default PostForm