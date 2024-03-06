"use client"
import "@/assets/css/output.css";
import Navbar from "@/components/Nav";
import Footer from "@/components/Footer";
import PostRender from "@/components/posts/PostRender";


function ViewPosts(): JSX.Element {
  return (
      <div>
        <Navbar />

        <PostRender />

        <Footer />
      </div>
  );
}

export default ViewPosts;
