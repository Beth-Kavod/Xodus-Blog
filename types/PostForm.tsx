import VideoLinkSchema from './VideoLinkSchema'
import AddressSchema from './AddressSchema'

interface PostForm {
  title: string,
  content: string,
  author: string,
  tags: Array<string>;
  addresses: Array<AddressSchema>;
  imageUrls: Array<string>
  videoLinks: Array<VideoLinkSchema>
}

export default PostForm