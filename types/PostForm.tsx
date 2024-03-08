import VideoLinkSchema from './VideoLinkSchema'
import AddressSchema from './AddressSchema'
import User from './User'

interface PostForm {
  title: string,
  content: string,
  author: User,
  tags: Array<string>;
  addresses: Array<AddressSchema>;
  imageUrls: Array<string>
  videoLinks: Array<VideoLinkSchema>
}

export default PostForm