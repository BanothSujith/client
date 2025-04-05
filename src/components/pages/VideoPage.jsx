import { useLocation } from "react-router";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { LuSendHorizontal } from "react-icons/lu";
import { BsThreeDotsVertical } from "react-icons/bs";
import VideoPageCard from "../../cards/VideopageCard";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import {
  AiOutlineLike,
  AiFillLike,
  AiOutlineDislike,
  AiFillDislike,
} from "react-icons/ai";
import Message from "../../utility/Message";
import { AnimatePresence, motion } from "framer-motion";

function VideoPage() {
  const location = useLocation();
  const { video } = useParams();
  const navigate = useNavigate();
  const [videoData, setVideoData] = useState(null);
  const [comment, setComment] = useState("");
  const [commentSendButton, setCommentSendButton] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(null);
  const [isLiked, setIsLiked] = useState(null);
  const [isUnliked, setIsunliked] = useState(null);
  const [likedCount, setLinkedCount] = useState(0);
  const [dislikedCount, setDislikedCount] = useState(0);
  const [readComents, setReadComments] = useState(false);
  const filteredRelatedVideos = useSelector(
    (state) => state.videoPlaying.videos
  );
  const videoplayingRef = useRef(null);
  useEffect(() => {
    const video = videoplayingRef.current;

    return () => {
      if (!video) return;
      const isVideoPlaying = (video) => {
        return (
          video &&
          !video.paused &&
          !video.ended &&
          video.readyState > 2
        );
      };
      const tryEnterPiP = async () => {
        if (!document.pictureInPictureElement && !document.fullscreenElement && isVideoPlaying(video)) {
          video.requestPictureInPicture().catch((err) => {
            console.warn("Failed to enter PiP:", err);
          });
          video.play()
        }
      };

      if (video.readyState >= 1) {
        tryEnterPiP();
      } else {
        const onMetadataLoaded = () => {
          tryEnterPiP();
        };
        video.addEventListener("loadedmetadata", onMetadataLoaded, {
          once: true,
        });
      }
    };
  }, [location.pathname]);

  // Exit Picture-in-Picture when arriving back at the video page
  useEffect(() => {
    const exitPiP = async () => {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture().catch((err) => {
          console.warn("Failed to exit PiP:", err);
        });
      }
    };

    exitPiP();
  }, [location.pathname]);

  const relatedBlogs = filteredRelatedVideos?.filter((item) => {
    if (!videoData || item._id === videoData._id) return false;

 
    const creatorName = videoData?.userName?.toLowerCase() || "";


    const itemCreator = item?.createdBy?.userName?.toLowerCase() || "";

    return itemCreator.includes(creatorName);
  });
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_BACKEND_URI}/video/${video}`,
          {
            withCredentials: true,
          }
        );
        setVideoData(response.data.video);
        setIsSubscribed(response.data.video.isSubscribed);
        setIsLiked(response.data.video.isLiked);
        setLinkedCount(response.data.video.likeCount);
        setIsunliked(response.data.video.isUnliked);
        setDislikedCount(response.data.video.dislikeCount);
      } catch (error) {
        Message(error.response?.data?.error || "An error occurred");
      }
    };

    fetchVideo();
  }, [video]);

  const handleSubmit = async () => {
    if (!comment.trim()) return;

    setCommentSendButton(true);
    try {
      const data = await axios.post(
        `${import.meta.env.VITE_APP_BACKEND_URI}/${video}/comments`,
        { comment },
        { withCredentials: true }
      );

      if (data.statusText === "Created") {
        setComment("");
        setVideoData((prev) => ({
          ...prev,
          comments: prev.comments.concat(data.data.comment),
        }));
        Message("Comment sent successfully", "OK");
      }
    } catch (error) {
      console.error("Failed to send comment:", error);
    } finally {
      setCommentSendButton(false);
    }
  };
  const handleSubscribe = async () => {
    if (!Cookies.get("token")) return navigate("/login");
    const response = await axios.post(
      ` ${import.meta.env.VITE_APP_BACKEND_URI}/subscribe`,
      { channelId: videoData?.ownerId },
      { withCredentials: true }
    );
    if (response.data.message === "Subscribed successfully") {
      setIsSubscribed(true);
      setVideoData((prev) => ({
        ...prev,
        subscribersCount: prev.subscribersCount + 1,
      }));
      Message("Subscribed successfully", "OK");
    } else {
      Message("Unsubscribed successfully", "OK");
      setVideoData((prev) => ({
        ...prev,
        subscribersCount: prev.subscribersCount - 1,
      }));
      setIsSubscribed(false);
    }
    // console.log(response.data.message);
  };
  const hanldelike = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_BACKEND_URI}/like/${video}`,
        {},
        { withCredentials: true }
      );
      // console.log(response.data.message);
      if (response.data.message === "undoLiked") {
        setIsLiked(true);
        setIsunliked(false);
        setLinkedCount((prev) => prev + 1);
        isUnliked ? setDislikedCount((prev) => prev - 1) : "";
      } else {
        setIsLiked(false);
        setLinkedCount((prev) => prev - 1);
      }
    } catch (error) {
      console.error("Error liking video:", error);
    }
  };

  const hanldeUnlike = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_BACKEND_URI}/unlike/${video}`,
        {},
        { withCredentials: true }
      );
      const { message } = response.data;
      if (message === "undoUnLiked") {
        setIsunliked(true);
        setIsLiked(false);
        setDislikedCount((prev) => prev + 1);
        isLiked ? setLinkedCount((prev) => prev - 1) : " ";
      }
      if (message === "Unliked") {
        setIsunliked(false);
        setDislikedCount((prev) => prev - 1);
      }
    } catch (error) {
      console.error("Error unliking video:", error);
    }
  };

  function handleUserprofile(e) {
    const clickedButton = e.target.closest("button");
    if (clickedButton && clickedButton.classList.contains("subscribe")) {
      e.preventDefault();
      return;
    }
    if (!videoData?.ownerId) return;
    navigate(`/user/${videoData?.ownerId}`);
  }
  return (
    <div className="w-full h-full pb-12 overflow-auto scrollbar scroll-scroll-smooth">
      {/* Video Player */}
      <video
        ref={videoplayingRef}
        src={videoData?.videoUrl}
        controls
        controlsList="nodownload"
        className="w-full lg:h-[80vh]"
      />

      <div className="w-full h-full lg:flex px-4 gap-12">
        {/* Left Section (Video Details & Comments) */}
        <div className=" w-full lg:w-[60%] flex flex-col gap-2 md:gap-4 text-[var(--text)] ">
          <p className="text-lg font-medium w-full h-full max-h-fit leading-normal  line-clamp-2">
            {videoData?.title}
          </p>

          {/* User Info */}
          <div className="flex flex-col gap-4 md:flex-row w-full justify-between">
            <div
              className="flex items-start min-w-fit"
              onClick={(e) => handleUserprofile(e)}
            >
              <img
                src={videoData?.profile ? videoData.profile : "/logosns.png"}
                alt="profile"
                className="h-12 w-12 rounded-full object-center object-cover aspect-square bg-gray-400"
              />
              <div className="flex flex-col px-4">
                <span className=" text-sm md:text-lg  font-bold line-clamp-1">
                  {videoData?.userName || "Anonymous"}
                </span>
                <div className="flex gap-1 items-center text-sm font-semibold">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={videoData?.subscribersCount}
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -10, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-sm font-semibold"
                    >
                      {videoData?.subscribersCount}
                    </motion.span>
                  </AnimatePresence>
                  <span>subscribers</span>
                </div>
              </div>
              <button
                onClick={handleSubscribe}
                className={`subscribe capitalize md:mx-4 px-4 w-fit py-1 border rounded-sm border-[#f1a6a6] `}
              >
                {isSubscribed ? "subscribed" : "subscribe"}
              </button>
            </div>

            <div className="px-12 w-full md:max-w-[50%]  flex text-[var(-text)] items-center  gap-6 text-3xl">
              <button
                onClick={hanldelike}
                className="flex gap-1 flex-row-reverse "
              >
                {isLiked ? <AiFillLike /> : <AiOutlineLike />}{" "}
                <AnimatePresence mode="wait">
                  <motion.span
                    key={likedCount}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-xl font-bold"
                  >
                    {likedCount}
                  </motion.span>
                </AnimatePresence>
              </button>
              <button
                onClick={hanldeUnlike}
                className=" flex gap-1 flex-row-reverse items-end"
              >
                {isUnliked ? <AiFillDislike /> : <AiOutlineDislike />}
                <AnimatePresence mode="wait">
                  <motion.span
                    key={dislikedCount}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-xl font-bold"
                  >
                    {dislikedCount}
                  </motion.span>
                </AnimatePresence>
              </button>
            </div>
          </div>

          {/* Video Description */}
          <div className="w-full h-28 my-4">
            <fieldset className="w-full h-full border-2 border-[var(--text)] px-4 overflow-auto scrollbar rounded-md">
              <legend className="text-xl">Description</legend>
              <p className="text-sm">
                {videoData?.content || "No Description Available"}
              </p>
            </fieldset>
          </div>

          {/* Comment Input */}
          <form
            className="flex w-full items-center gap-8 justify-between"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              placeholder="Comment here..."
              value={comment}
              onChange={(e) => {
                setComment(e.target.value);
                setCommentSendButton(!e.target.value.trim());
              }}
              className="w-full h-12 rounded-md border-2 border-[var(--text)] px-4 outline-none bg-transparent"
            />
            <button
              disabled={commentSendButton}
              onClick={handleSubmit}
              className="cursor-pointer disabled:cursor-not-allowed"
            >
              <LuSendHorizontal className="text-3xl" />
            </button>
          </form>

          {/* Comments Section */}
          <h1 className="text-2xl font-semibold capitalize">
            {videoData?.comments?.length || 0} comments
          </h1>
          <AnimatePresence>
            {videoData?.comments?.length > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{
                  height: readComents ? "auto" : 40,
                  opacity: 1,
                }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <div
                  className={`${
                    readComents && videoData?.comments?.length > 0
                      ? "h-full"
                      : "h-10 lg:h-fit"
                  }   flex flex-col gap-4 overflow-hidden lg:overflow-auto`}
                >
                  {videoData?.comments?.map((comment, index) => (
                    <div
                      key={index}
                      className="w-full px-2 md:p-2 flex justify-between items-center"
                    >
                      <div>
                        <p className="text-xs font-semibold">
                          -{comment?.creatorName || "Anonymous"}
                        </p>
                        <p className="text-[gray] text-sm px-2">
                          {comment?.content}
                        </p>
                      </div>
                      <span>
                        <BsThreeDotsVertical />
                      </span>
                    </div>
                  ))}
                </div>
                <button
                  className={`w-full   text-xs text-right capitalize px-8 text-[var(--text)] opacity-40 lg:hidden ${
                    videoData?.comments?.length > 1 ? "" : "hidden"
                  } `}
                  onClick={() => setReadComments(!readComents)}
                >
                  ...{readComents ? "See less" : "See more"}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Section (Related Videos) */}
        <div className="h-full lg:w-[35%] md:px-4 ">
          <h1 className="text-2xl text-[var(--text)] font-semibold p-4">
            Related Videos
          </h1>
          <div className="flex flex-col gap-4 h-fit  overflow-auto scrollbar pb-16">
            {relatedBlogs?.map((item) => (
              <div key={item._id}>
                <VideoPageCard item={item} />
              </div>
            )) || (
              <p className="p-4 text-[var(--text)]">No related videos found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoPage;
