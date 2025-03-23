import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 

function BlogType({setShowBlogType}) {
  const navigate = useNavigate();
  const [selectedBlog, setSelectedBlog] = useState("");

  const handleBlogPost = (blog) => {
    setSelectedBlog(blog); 
    navigate(`/${blog}`); 
    setShowBlogType(false)
  };

  return (
    <div className="bg-[var(--bg-card)] w-fit  px-4  py-1 rounded-lg flex items-center justify-center flex-col " >
      <p className="text-[var(--text)]  ">BlogType</p>
      <div>
        <label className="flex items-center space-x-2 cursor-pointer" onClick={()=>handleBlogPost("blogvideo")}>
          <input
            type="radio"
            checked={selectedBlog === "blogvideo"}
            onChange={() => handleBlogPost("blogvideo")}
          />
          <span className="text-[var(--text)]">Video</span>
        </label>
      </div>
      <div>
        <label className="flex items-center space-x-2 cursor-pointer" onClick={()=>handleBlogPost("blogimg")}>
          <input
            type="radio"
            checked={selectedBlog === "blogimg"}
            onChange={() => handleBlogPost("blogimg")}
          />
          <span className="text-[var(--text)]">Image</span>
        </label>
      </div>
    </div>
  );
}

export default BlogType;
