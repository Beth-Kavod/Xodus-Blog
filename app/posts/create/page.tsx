"use client"
import "@/assets/css/output.css"

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { useUser } from '@/components/UserContext'

import Navbar from "@/components/Nav";
import Footer from "@/components/Footer";
import BlogPostForm from '@/components/forms/BlogPostForm'

import PostForm from '@/types/PostForm'
import Image from '@/types/Image'

interface ImageInput {
  images: Image[],
  setImages: React.Dispatch<React.SetStateAction<Image[]>>
}

function CreatePostPage(): JSX.Element {
  const { user } = useUser() 
  const router = useRouter()
  
  const [images, setImages] = useState<Image[]>([])
  // Initialize the image file as null
  const [form, setForm] = useState<PostForm>({
    title: "",
    content: "",
    author: {
      username: user.username,
      id: user.id
    },
    addresses: [],
    tags: [],
    imageUrls: [],
    videoLinks: []
  });  

  if (!user.id) {
    router.push("/accounts/login")
  }

  return (
    <div className="w-full h-fit bg-dark-background">
      <Navbar />

      <BlogPostForm formInputs={{form, setForm}} imageInputs={{images, setImages} as ImageInput} />

      <Footer />
    </div>
  );
}

export default CreatePostPage;
