import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { BsCloudUpload } from "react-icons/bs";
import Message from "../../utility/Message";

const imageFormats = ["image/jpeg", "image/png", "image/gif", "image/webp"];

function CreateImgBlog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverImg, setCoverImg] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("user")) {
      Message("Please login to create a blog.", "warning");
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
        navigate("/");
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
    <div className="flex justify-center items-center min-h-screen bg-[var(--bg-body)] text-[var(--text)]">
      <form
        onSubmit={handleSubmit}
        className="relative bg-[var(--bg-card)] p-6 rounded-lg shadow-md w-96 space-y-4"
      >
          <div className="absolute top-1 right-1 bg-red-600 w-3 flex items-center justify-center text-white h-3 text-xs pb-[1px] rounded-full hover:bg-red-900 active:scale-95 transition-all duration-75 ease-linear cursor-pointer" onClick={()=>window.history.back()}>
          x
        </div>
        <h2 className="text-2xl font-semibold text-center">Upload Image Blog</h2>
        {/* Thumbnail Upload */}
        <div
          {...getThumbnailRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition ${
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
          <label className="block font-medium">Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-2 rounded mt-1 text-[var(--text)] bg-transparent focus-within:bg-[var(--bg-body)]"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium">Description</label>
          <textarea
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border p-2 rounded mt-1 text-[var(--text)] bg-transparent focus-within:bg-[var(--bg-body)]"
            rows="4"
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
        >
          {loading? "Uploading...":"upload"}
        </button>
      </form>
    </div>
  );
}

export default CreateImgBlog;
