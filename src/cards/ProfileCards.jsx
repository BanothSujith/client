import React from "react";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router";

function ProfileCards({ blog }) {
  const navigate = useNavigate();
  if (!blog || typeof blog !== "object") {
    return <p>Error: Invalid blog data</p>;
  }
  return (
    <div
      className="text-[var(--text)] p-1 h-full "
      onClick={() => {
       (blog.blogtype === "video")? navigate(`/video/${blog._id}`) : "";
      }}
    >
      {/* Cover Image */}
      <div>
        <img
          src={blog?.coverimgUrl || "/default.jpg"}
          alt="cover img"
          className="w-full aspect-square object-cover rounded-lg"
        />
      </div>

      {/* Blog Content */}
      <div className="flex flex-col gap-1 px-2 ">
        {/* Title with Multiple Lines */}
        <p className="font-bold text-lg  line-clamp-2 leading-tight">
          {blog?.title || "Untitled"}
        </p>

        {/* Views Count */}
        <p className="flex  gap-3 text-xs font-semibold">
          <span>{blog?.views || 0} views</span>
          <span>
            {formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true })}
          </span>
        </p>
      </div>
    </div>
  );
}

export default ProfileCards;
