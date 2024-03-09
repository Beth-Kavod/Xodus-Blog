import React, { SyntheticEvent, useState, useEffect } from "react"
import { useRouter } from  'next/navigation'
import { useUser } from '@/components/UserContext'
import { uploadImages } from '@/utils/routeMethods'

import ImageUpload from '@/components/ImageUpload'
import CarouselEditImages from '@/components/carousel/CarouselEditImages'

import Image from '@/types/Image'
import PostForm from '@/types/PostForm'

// Component to create more input fields
const AddAddress: React.FC = () => {
  const [addresses, setAddresses] = useState<string[]>(['']);

  const handleInputChange = (index: number, value: string) => {
    const newAddresses = [...addresses];
    newAddresses[index] = value;
    setAddresses(newAddresses);
  };

  const handleAddAddress = () => {
    setAddresses([...addresses, '']);
  };

  const handleRemoveAddress = (index: number, event: SyntheticEvent) => {
    event.preventDefault()
    const newAddresses = [...addresses];
    newAddresses.splice(index, 1);
    setAddresses(newAddresses);
  };

  return (
    <>
      <h1 className="text-lg py-2"> Add Address </h1>

      {addresses.map((address, index) => (
        <div key={index} className="relative d-flex justify-center flex-row">
          <input
            onChange={(event) => handleInputChange(index, event.target.value)}
            value={address}
            className="text-sm w-full my-2 px-2 py-1 border border-light-border rounded-md outline-none focus:ring-1 focus:ring-green-500"
            type="text"
            placeholder="12345 example drive Clarkson Nebraska"
          />
          <button
            onClick={(event) => handleRemoveAddress(index, event)}
            className="top-0 right-0 text-red-500 px-2 py-1 focus:outline-none"
          >
          X
          </button>
        </div>
      ))}
      
      <button onClick={handleAddAddress} className="bg-light-theme-green text-white rounded-lg px-4 py-1.5 hover:bg-light-theme-green-active">Add Address</button>
    </>
  );
};

interface BlogPostParams {
  formInputs: {
    form: PostForm;
    setForm: React.Dispatch<React.SetStateAction<PostForm>>;
  }
  imageInputs: {
    images: Image[];
    setImages: React.Dispatch<React.SetStateAction<Image[]>>;
  }
}

const BlogPostForm = ({ formInputs, imageInputs }: BlogPostParams) => {
  const { user } = useUser()
  const router = useRouter()

  const { form, setForm } = formInputs
  const { images, setImages } = imageInputs

  const handleSubmit = async (event: SyntheticEvent): Promise<void> => {
    event.preventDefault();

    try {
      const imageData = new FormData()
      imageData.append("upload_preset", "Blog_Images")
      images.map(image => {
        imageData.append("file", image.file)
      })

      const uploadedImages = await uploadImages(imageData as FormData)

      const response = await fetch("/api/posts/create-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...form,
          images: uploadedImages.data
        })
      });

      const responseData = response.json()
      console.log(responseData)
      
      router.push("/");
    } catch (err) {
      console.error(err);
    }
  };

  const textareaStyles: any = {
      height: "400px",
      resize: "none"
  };

  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  };

  return (
    <form onSubmit={handleSubmit} className="w-2/3 mx-auto h-fit pb-12">
      <h1 className="font-bold text-3xl px-2 py-10">
          Create a Post
      </h1>

      <div className="h-fit w-full rounded-md p-6 bg-dark-background border border-light-border">
          <h1 className="text-lg py-2"> Title </h1>
          <p className="text-xs"> Enter your posts title </p>
          <input onChange={handleInputChange} className="text-sm w-full my-2 px-2 py-1 border border-light-border rounded-md outline-none focus:ring-1 focus:ring-green-500" type="text" name="title" placeholder="eg. 10 Reasons Why Go is Better Than Rust." required />
      </div> 

      <div className="h-fit w-full my-5 rounded-md p-6 bg-dark-background border border-light-border">
          <h1 className="text-lg py-2"> Post Description </h1>
          {/* <p className="text-xs"> Enter your posts details here </p> */}
          <textarea onChange={handleInputChange} style={textareaStyles} className="text-sm w-full my-2 px-2 py-1 border border-light-border rounded-md outline-none focus:ring-1 focus:ring-green-500 resize-none" name="content" placeholder="eg. Right off the bat, there are clear differences between Go and Rust. Go has a stronger focus on building web APIs and small services that can scale endlessly, especially with the power of Goroutines. The latter is also possible with Rust, but things are much harder from a developer experience point of view..." required />
          {/* Fix this before uncommenting */}
          {/* <AddAddress /> */}
      </div>

      <div className="h-fit w-full my-5 rounded-md p-6 bg-dark-background border border-light-border">
        <h1 className="text-lg py-2"> Add Images </h1>

          <ImageUpload
            params={{ setImages }}
          />
          {
            images && images.length ? 
            <CarouselEditImages 
              images={images}
              setImages={setImages}
            /> : null
          }
      </div>
      <button type="submit" className="bg-light-theme-green text-white rounded-lg px-4 py-1.5 hover:bg-light-theme-green-active"> Create Post </button>
    </form>
  )
}

export default BlogPostForm;
