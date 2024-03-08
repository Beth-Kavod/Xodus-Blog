import VideoLinkSchema from './VideoLinkSchema'
import AddressSchema from './AddressSchema'
import Author from './Author'

interface PostForm {
  title: string,
  content: string,
  author: Author,
  tags: Array<string>;
  addresses: Array<AddressSchema>;
  imageUrls: Array<string>
  videoLinks: Array<VideoLinkSchema>
}

export default PostForm