import React, { useEffect, useState } from "react";
import {
  BsHeart,
  BsHeartFill,
  BsHeartbreak,
  BsHeartbreakFill,
} from "react-icons/bs";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import SkeletonPage from "./SkeltonHome";
import Message from "../../utility/Message";
import { useDispatch, useSelector } from "react-redux";
import { setGalleryVideos } from "../../reduxstore/slices";
import { AnimatePresence, motion } from "framer-motion";

function GalleryPage() {
  const [likeStatus, setLikeStatus] = useState({});
  const [Loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const galleryBlogs =
    useSelector((state) => state.videoPlaying.galleryVideos) || [];
  useEffect(() => {
    const fetchGalleryBlogs = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_APP_BACKEND_URI}/gallery`,
          { withCredentials: true }
        );
        console.log(response.data);
        setLoading(false);
        // Message(response.data.message, response.statusText);
        if (response.data && response.data.galleryBlogs) {
          dispatch(setGalleryVideos(response.data.galleryBlogs));

          const initialLikeStatus = {};
          response.data.galleryBlogs.forEach((post) => {
            initialLikeStatus[post._id] = {
              liked: post.isLiked || false,
              unliked: post.isUnliked || false,
              likeCount: post.likeCount || 0,
              unlikeCount: post.unlikeCount || 0,
            };
          });
          setLikeStatus(initialLikeStatus);
        } else {
          console.error("Unexpected response structure:", response.data);
        }
      } catch (error) {
        console.error("Error from server:", error);
      }
    };

    fetchGalleryBlogs();
  }, []);

  const toggleLike = async (postId) => {
    try {
      const updatedLikeStatus = { ...likeStatus };
      const post = updatedLikeStatus[postId];

      let newLikedState = !post.liked;
      let newUnlikedState = false;
      let newLikeCount = post.likeCount;
      let newUnlikeCount = post.unlikeCount;

      if (newLikedState) {
        newLikeCount += 1;
        if (post.unliked) {
          newUnlikeCount -= 1;
        }
      } else {
        newLikeCount -= 1;
      }

      updatedLikeStatus[postId] = {
        liked: newLikedState,
        unliked: newUnlikedState,
        likeCount: newLikeCount,
        unlikeCount: newUnlikeCount,
      };

      setLikeStatus(updatedLikeStatus);

      const response = await axios.post(
        `${import.meta.env.VITE_APP_BACKEND_URI}/like/${postId}`,
        { liked: newLikedState },
        { withCredentials: true }
      );
      // Message(response.data.message);
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const toggleUnlike = async (postId) => {
    try {
      const updatedLikeStatus = { ...likeStatus };
      const post = updatedLikeStatus[postId];

      let newUnlikedState = !post.unliked;
      let newLikedState = false;
      let newUnlikeCount = post.unlikeCount;
      let newLikeCount = post.likeCount;

      if (newUnlikedState) {
        newUnlikeCount += 1;
        if (post.liked) {
          newLikeCount -= 1;
        }
      } else {
        newUnlikeCount -= 1;
      }

      updatedLikeStatus[postId] = {
        liked: newLikedState,
        unliked: newUnlikedState,
        likeCount: newLikeCount,
        unlikeCount: newUnlikeCount,
      };

      setLikeStatus(updatedLikeStatus);
      const response = await axios.post(
        `${import.meta.env.VITE_APP_BACKEND_URI}/unlike/${postId}`,
        { unliked: newUnlikedState },
        { withCredentials: true }
      );
      // Message(response.data.message);
    } catch (error) {
      console.error("Error unliking post:", error);
    }
  };

  return (
    <div className="w-full h-full p-2 pb-28 md:pb-36 lg:pb-20  overflow-auto">
      {Loading ? (
        <SkeletonPage />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-y-4 gap-x-4 items-center justify-center">
          {galleryBlogs.length > 0 ? (
            galleryBlogs.map((data) => (
              <div
                key={data._id}
                className="bg-[var(--bg-card)] p-1 rounded-lg flex flex-col gap-3 w-full h-[26rem] aspect-square"
              >
                {/* User Info */}
                <div className="flex gap-4 items-center text-[var(--text)]">
                  <img
                    src={
                      data.owner?.profile || "https://via.placeholder.com/150"
                    }
                    alt="Profile"
                    className="rounded-full w-8 aspect-square"
                  />
                  <p className="flex flex-col leading-none">
                    <span className="font-semibold text-xl leading-none">
                      {data?.owner?.userName || "Anonymous"}
                    </span>
                    <span className="text-xs">
                      {data?.owner?.subscribers || 0} subscribers
                    </span>
                  </p>
                </div>

                {/* Image & Actions */}
                <div className="h-full w-full flex flex-col gap-2">
                  <img
                    src={data.coverimgUrl}
                    alt="Uploaded"
                    className="w-full h-64 "
                  />

                  {/* Like, Dislike, Comment */}
                  <p className="flex gap-6 px-4 items-center text-2xl">
                    <span
                      className="text-[#eb6b91] cursor-pointer flex flex-row-reverse gap-2 items-center justify-center"
                      onClick={() => toggleLike(data._id)}
                    >
                      {likeStatus[data._id]?.liked ? (
                        <BsHeartFill />
                      ) : (
                        <BsHeart />
                      )}
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={likeStatus[data._id]?.likeCount}
                          initial={{ y: 10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{rotate:360, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="text-lg"
                        >
                          {likeStatus[data._id]?.likeCount}{" "}
                        </motion.span>
                      </AnimatePresence>
                    </span>

                    <span
                      className="text-[#eb6b91] cursor-pointer flex flex-row-reverse gap-2 items-center justify-center"
                      onClick={() => toggleUnlike(data._id)}
                    >
                      {likeStatus[data._id]?.unliked ? (
                        <BsHeartbreakFill />
                      ) : (
                        <BsHeartbreak />
                      )}

                      <AnimatePresence mode="wait">
                        <motion.span
                          key={likeStatus[data._id]?.unlikeCount}
                          initial={{ y: 10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ rotate:360, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="text-lg"
                        >
                          {likeStatus[data._id]?.unlikeCount}
                        </motion.span>
                      </AnimatePresence>
                    </span>
                  </p>

                  {/* Description */}
                  <p className="w-full px-2 text-[var(--text)]">
                    <span className="w-full text-[var(--text)] text-xs">
                      {formatDistanceToNow(new Date(data?.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                    <span className="text-sm leading-tight font-semibold line-clamp-2">
                      {data?.title}
                    </span>
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400 w-full">
              No posts available.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default GalleryPage;
