"use client"
import "@/assets/css/output.css"
import { SyntheticEvent, useState, useEffect } from "react"
import { useRouter } from  'next/navigation'
import { useUser } from '@/components/UserContext'
import Navbar from "@/components/Nav";
import Footer from "@/components/Footer";

import Image from '@/types/Image'
//  Can't use yet
// import { uploadImages } from '@/utils/routeMethods'

import PostForm from '@/types/PostForm'

function EditPostPage(): JSX.Element {
    const { user } = useUser()
    const router = useRouter()
  
    // Initialize the image file as null
    const [images, setImages] = useState<Image[]>([])
    const [form, setForm] = useState<PostForm>({
      title: "",
      content: "",
      author: user,
      imageUrls: [],
      videoLinks: [],
      addresses: [],
      tags: []
    });
  
    const handleSubmit = async (event: SyntheticEvent): Promise<void> => {
      event.preventDefault();
    
      try {
        let uploadedImages
        if (images.length) {
          uploadedImages = await handleImageUpload()
        }

        await fetch("/api/posts/edit-post", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(form), // Send the PostForm object
        });
        
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

    const handleImageUpload = async () => {
      const returnedImages = []
      const imageData = new FormData()
      images.forEach(image => {
        if (image.file === "Uploaded") {
          returnedImages.push(image.preview)
          return
        }
        imageData.append(`file`, image.file);
      })

      

      return 
    }

    return (
        <div className="w-full h-fit bg-light-background">
            <Navbar />

            <form onSubmit={handleSubmit} className="w-2/3 mx-auto h-fit pb-12">
                <h1 className="font-bold text-3xl px-2 py-10">
                    Create a Post
              </h1>

                <div className="h-fit w-full rounded-md p-6 bg-white border border-light-border">
                    <h1 className="text-lg py-2"> Title </h1>
                    <p className="text-xs"> Enter your posts title </p>
                    <input onChange={handleInputChange} className="text-sm w-full my-2 px-2 py-1 border border-light-border rounded-md outline-none focus:ring-1 focus:ring-green-500" type="text" name="title" placeholder="eg. 10 Reasons Why Go is Better Than Rust." required />
                </div> 

                <div className="h-fit w-full my-5 rounded-md p-6 bg-dark border border-light-border">
                    <h1 className="text-lg py-2"> Post Details </h1>
                    <p className="text-xs"> Enter your posts details here </p>
                    <textarea onChange={handleInputChange} style={textareaStyles} className="text-sm w-full my-2 px-2 py-1 border border-light-border rounded-md outline-none focus:ring-1 focus:ring-green-500 resize-none" name="content" placeholder="eg. Right off the bat, there are clear differences between Go and Rust. Go has a stronger focus on building web APIs and small services that can scale endlessly, especially with the power of Goroutines. The latter is also possible with Rust, but things are much harder from a developer experience point of view..." required />

                    <input
                        type="file"
                        // onChange={handleImageUpload}
                        onSubmit={handleInputChange}
                        accept="image/*" // Restrict file type to images
                        className="file:rounded-md file:bg-light-theme-green file:text-white file:outline-none file:border-0 file:p-1 file:px-2 file:mr-4 text-sm file:hover:bg-light-theme-green-active file:cursor-pointer"
                    />
                </div>
                <button type="submit" className="bg-light-theme-green text-white rounded-lg px-4 py-1.5 hover:bg-light-theme-green-active"> Create Post </button>
            </form>

            <Footer />
        </div>
    );
}

export default EditPostPage;
