import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { LuSendHorizontal } from "react-icons/lu";
import { BsThreeDotsVertical } from "react-icons/bs";
import VideoPageCard from "../../cards/VideopageCard";
import { useSelector } from "react-redux";
import {
  AiOutlineLike,
  AiFillLike,
  AiOutlineDislike,
  AiFillDislike,
} from "react-icons/ai";
import Message from "../../utility/Message";

function VideoPage() {
  const { video } = useParams();
  const navigate = useNavigate();
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [commentSendButton, setCommentSendButton] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(null);
  const [isLiked, setIsLiked] = useState(null);
  const [isUnliked,setIsunliked] = useState(null);
  const [likedCount , setLinkedCount] = useState(null);
  const [dislikedCount , setDislikedCount] = useState(null);
  const [readComents, setReadComments] = useState(false);
  const relatedBlogs = useSelector((state) => state.videoPlaying.videos);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URI}/video/${video}`, {
          withCredentials: true,
        });
        setVideoData(response.data.video);
        setIsSubscribed(response.data.video.isSubscribed);
        setIsLiked(response.data.video.isliked);
        setLinkedCount(response.data.video.likeCount)
        setIsunliked(response.data.video.isUnliked);
        setDislikedCount(response.data.video.dislikeCount)
        Message(response.data.message);
      } catch (error) {
        Message(error.response?.data?.error || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [video]);

  const handleSubmit = async () => {
    if (!comment.trim()) return;

    setCommentSendButton(true);
    try {
      const data = await axios.post(
        `/api/${video}/comments`,
        { comment },
        { withCredentials: true }
      );

      if (data.statusText === "Created") {
        setComment("");
        setMessage("Comment sent successfully");
      }
    } catch (error) {
      console.error("Failed to send comment:", error);
    } finally {
      setCommentSendButton(false);
    }
  };
  const handleSubscribe = async () => {
    const response = await axios.post(
      "/api/subscribe",
      { channelId: videoData?.ownerId },
      { withCredentials: true }
    );
    if (response.data.message === "Subscribed successfully") {
      setIsSubscribed(true);
    } else {
      setIsSubscribed(false);
    }
    // console.log(response.data.message);
  };
  const hanldelike = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_APP_BACKEND_URI}/like/${video}`,  {}, { withCredentials: true });
  
      if (response.data.message === "Liked") {
        setIsLiked(true);
        setIsunliked(false); 
      } else {
        setIsLiked(false);
      }
    } catch (error) {
      console.error("Error liking video:", error);
    }
  };
  
  const hanldeUnlike = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_APP_BACKEND_URI}/unlike/${video}`,{}, { withCredentials: true });
  console.log(response.data.message)
      if (response.data.message === "undoUnLiked") {
        setIsunliked(true);
        setIsLiked(false);
      } else {
        setIsunliked(false);
      }
    } catch (error) {
      console.error("Error unliking video:", error);
    }
  };
  
  return (
    <div className="w-full h-full overflow-auto">
      {/* Video Player */}
      <video
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
          <div className="flex flex-col gap-4 md:flex-row w-full justify-between ">
            <div className="flex items-start ">
              <img
                src={videoData?.profile ? videoData.profile : "/logosns.png"}
                alt="profile"
                className="h-12 w-12 rounded-full object-center object-cover aspect-square bg-gray-400"
              />
              <p className="flex flex-col px-4">
                <span className=" text-sm md:text-lg  font-bold line-clamp-1">
                  {videoData?.userName || "Anonymous"}
                </span>
                <span className="text-sm font-semibold">
                  {videoData?.subscribersCount} subscribers
                </span>
              </p>
              <button
                onClick={handleSubscribe}
                className={`capitalize md:mx-4 px-4 w-fit py-1 border rounded-sm border-[#f1a6a6] `}
              >
                {isSubscribed ? "subscribed" : "subscribe"}
              </button>
            </div>

            <div className="px-12 w-full md:max-w-[50%]  flex text-[var(-text)] items-center gap-6 text-3xl">
              <button onClick={hanldelike} className="flex gap-1 flex-row-reverse ">
                {isLiked ? <AiFillLike /> : <AiOutlineLike />} <span className="text-xl font-bold">{likedCount}</span>
              </button>
              <button onClick={hanldeUnlike} className=" flex gap-1 flex-row-reverse items-end">{isUnliked ? <AiFillDislike /> : <AiOutlineDislike />}<span className="text-xl font-bold">{dislikedCount}</span></button>
            </div>
          </div>

          {/* Video Description */}
          <div className="w-full h-28 my-4">
            <fieldset className="w-full h-full border-2 border-[var(--text)] px-4 overflow-auto hidescroolbar rounded-md">
              <legend className="text-xl">Description</legend>
              <p className="text-sm">
                {videoData?.content || "No Description Available"}
              </p>
            </fieldset>
          </div>

          {/* Comment Input */}
          <div className="flex w-full items-center gap-8 justify-between">
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
          </div>

          {/* Comments Section */}
          <h1 className="text-2xl font-semibold capitalize">
            {videoData?.comments?.length || 0} comments
          </h1>
          {videoData?.comments?.length > 0 && (
            <>
              <div
                className={`${
                  readComents && videoData?.comments?.length > 0
                    ? "h-full"
                    : "h-10 lg:h-full"
                }   flex flex-col gap-4 overflow-hidden lg:overflow-visible`}
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
                className={`text-xs text-right capitalize px-8 text-[var(--text)] opacity-40 lg:hidden ${
                  videoData?.comments?.length > 1 ? "" : "hidden"
                } `}
                onClick={() => setReadComments(!readComents)}
              >
                ...{readComents ? "See less" : "See more"}
              </button>
            </>
          )}
        </div>

        {/* Right Section (Related Videos) */}
        <div className="h-full lg:w-[35%] md:px-4   ">
          <h1 className="text-2xl text-[var(--text)] font-semibold p-4">
            Related Videos
          </h1>
          <div className="flex flex-col gap-4 h-full  ">
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
