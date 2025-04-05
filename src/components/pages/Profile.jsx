import React, { useState, useEffect } from "react";
import defaultprofile from "/src//assets/defaultprofile.png";
import bgimgforprofile from "/src//assets//bgimgforprofile.png"
import axios from "axios";
import ProfileCards from "../../cards/ProfileCards";
import { useParams } from "react-router";
const categories = ["All", "Video", "Image"];

const Profilepage = () => {
  const [profile, setProfile] = useState("");
  const [blogs, setBlogs] = useState(null);
  const [filteredBlogs, setFilteredBlogs] = useState("All");
  const {userprofile} = useParams();
  // console.log(profile.blogs);
  useEffect(() => {
    

    const fetchUserProfile = async () => {
      const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URI}/user/${userprofile}`, {
        withCredentials: true,
      });
      setProfile(response.data.user);
      setBlogs(response.data.user.blogs);
    };
    fetchUserProfile();
  }, []);

  // console.log(profile);

  const handleFilterBlogs = (item) => {
    setFilteredBlogs(item);
  };
  return (
    <div className="h-full bg-[var(--bg-color)] overflow-auto">
      <div>
        {/*Background profile image*/}
        <div className="relative h-[20vh] lg:h-[40vh]">
          <img
            src={profile.coverImg || bgimgforprofile}
            alt=""
            className="w-full h-full   object-cover"
          />
          <div className="absolute -bottom-12 md:-bottom-32 left-4 aspect-square rounded-full">
            <img
              src={profile?.profile || defaultprofile}
              alt="profile image"
              className="rounded-full w-28 md:w-60 aspect-square bg-[var(--bg-color)] p-1 object-cover"
            />
          </div>
        </div>
        {/*profile name with no of videos and Subscribers*/}
        <div className="flex flex-col md:gap-2 pl-32 md:pl-72 left-1/6  md:h-36 text-[var(--text)] capitalize pb-4">
          <h1 className="  text-2xl md:text-5xl line-clamp-1 font-semibold">
            {profile.userName || "guest"}
          </h1>
          <div className="flex gap-4  text-sm md:text-xl">
            <p>{profile.subscribersCount} subscribers</p>
            <p>{profile.totalBlogCount} Blogs</p>
          </div>
        </div>
      </div>

      {/*filter buttons*/}
      <div className="w-full  ">
        <nav className="flex gap-1 md:gap-2 w-full p-1">
          {categories.map((category, index) => (
            <button
              key={index}
              className={` text-[var(--text)] font-bold px-4 py-2 ${ category === filteredBlogs ? "bg-[var(--smallcard)]":'bg-[var(--bg-color)]'}  flex-1 transition duration-500 ease-in-out `}
              onClick={() => handleFilterBlogs(category)}
            >
              {category}
            </button>
          ))}
        </nav>
      </div>

      {/* Blogs */}

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-12 md:p-4">
        {blogs?.filter(
          (item) => filteredBlogs === "All" || item.blogtype === filteredBlogs.toLocaleLowerCase()
        ).length > 0 ? (
          blogs
            .filter(
              (item) =>
                filteredBlogs === "All" || item.blogtype === filteredBlogs.toLocaleLowerCase()
            )
            .map((blog) => <ProfileCards key={blog._id} blog={blog}  />)
        ) : (
          <p>No blogs available</p>
        )}
      </div>
    </div>
  );
};

export default Profilepage;
