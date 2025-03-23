import axios from "axios";
import React, { useEffect, useState, useRef, useCallback } from "react";
import HomeCard from "../../cards/HomeCard";
import SkeletonPage from "./SkeltonHome";
import Message from "../../utility/Message";
import { useDispatch, useSelector } from "react-redux";
import { setVideos } from "../../reduxstore/slices";
import { useNavigate } from "react-router";

function Home() {
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const observer = useRef(null);

  const blogs = useSelector((state) => state.videoPlaying.videos) || [];

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URI}/blogs`, {
          withCredentials: true,
        });
        const data = response.data.blogs;
        if (data.length === 0) {
          setHasMore(false); 
          return;
        }
        const uniqueBlogs = [...blogs, ...data].reduce((acc, blog) => {
          if (!acc.some((b) => b._id === blog._id)) {
            acc.push(blog);
          }
          return acc;
        }, []);
        dispatch(setVideos(uniqueBlogs)); 
      } catch (error) {
        Message(error.response?.data?.error || "Failed to fetch blogs");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [page, dispatch]);

  const lastBlogRef = useCallback(
    (node) => {
      if (!hasMore || !node) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setPage((prevPage) => prevPage + 1);
          }
        },
        { threshold: 1.0 }
      );

      observer.current.observe(node);
    },
    [hasMore]
  );

  return (
    <div className="w-full h-full overflow-hidden flex justify-center items-start md:px-2 py-2">
      {loading && page === 1 ? (
        <div className="w-full h-full">
          <SkeletonPage />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(16rem,1fr))] gap-6 w-full h-full justify-center items-start overflow-auto hidescroolbar">
          {blogs?.map((item, index) => (
            <div
              key={item._id}
              className="w-full md:max-w-[22rem] mx-auto"
              ref={index === blogs.length - 1 ? lastBlogRef : null}
              onClick={() => navigate(`video/${item._id}`)}
            >
              <HomeCard item={item} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
