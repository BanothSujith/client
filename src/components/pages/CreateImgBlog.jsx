import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { BsCloudUpload } from "react-icons/bs";
import Message from "../../utility/Message";

const Spinner = () => (
  <div className="flex justify-center items-center h-20">
    <img
      src="/carloader.webp"
      alt="Loading..."
      className="w-16 h-16 animate-spin"
    />
  </div>
);

const imageFormats = ["image/jpeg", "image/png", "image/gif", "image/webp"];

function CreateImgBlog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverImg, setCoverImg] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!document.cookie.includes("token")) {
      navigate("/login");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content || !coverImg) {
      Message("Please fill in all fields and upload an image.", "warning");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("coverImg", coverImg);

    setLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_APP_BACKEND_URI}/img`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (response.data.message === "Blog created successfully") {
        Message("Blog Posted Successfully!", "OK");
        setTitle("");
        setContent("");
        setCoverImg(null);
      } else {
        Message("Creating blog failed.", "error");
      }
    } catch (error) {
      console.error(error);
      Message("Cannot upload the post, please try again!", "error");
    } finally {
      setLoading(false);
    }
  };

  const {
    getRootProps: getThumbnailRootProps,
    getInputProps: getThumbnailInputProps,
    isDragActive: isThumbnailDragActive,
  } = useDropzone({
    multiple: false,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file && imageFormats.includes(file.type)) {
        setCoverImg(file);
      } else {
        Message("Only image files are allowed!", "warning");
      }
    },
  });

  return (
    <div className="p-4 flex flex-col gap-8 items-center h-full overflow-auto">
      <h1 className="text-3xl capitalize text-center font-bold text-[var(--text)]">
        upload image blog
      </h1>
      {loading && <Spinner />}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Thumbnail Upload */}
        <div
          {...getThumbnailRootProps()}
          className={`w-[20rem] md:w-[32rem] border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition ${
            isThumbnailDragActive
              ? "border-blue-500 bg-blue-100"
              : "border-[var(--border)] hover:bg-[var(--inputBg)]"
          }`}
        >
          <BsCloudUpload className="text-4xl text-[var(--text)] mb-2 mx-auto" />
          <input {...getThumbnailInputProps()} accept="image/*" />

          {coverImg ? (
            <p className="text-[var(--text)] font-bold">{coverImg.name}</p>
          ) : (
            <p className="text-[var(--text)] font-bold opacity-20">
              Drag & Drop or Click to upload image
            </p>
          )}
        </div>

        {/* Title */}
        <div>
          <label className="block text-xl tracking-wider text-[var(--text)] font-semibold">
            Title
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border-2 border-[var(--border)] rounded-lg outline-none bg-transparent focus:bg-[var(--inputBg)] text-[var(--text)]"
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-xl tracking-wider text-[var(--text)] font-semibold">
            Description
          </label>
          <textarea
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-3 border-2 text-[var(--text)] border-[var(--border)] outline-none bg-transparent rounded-lg"
            rows="4"
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          onClick={handleSubmit}
          className="w-full border border-[#511616] text-[var(--text)] text-lg font-semibold py-3 rounded-xl hover:bg-[var(--bg-card)] active:scale-95 transition-all duration-95 ease-linear"
        >
          Upload
        </button>
      </form>
    </div>
  );
}

export default CreateImgBlog;
