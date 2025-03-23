import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { BsCloudUpload } from "react-icons/bs";
import Message from "../../utility/Message";
import axios from "axios";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { setSettingsPageRequest } from "../../reduxstore/slices";
import { useNavigate } from "react-router";
import Loading3 from "./Loading3";

const imageFormats = ["image/jpeg", "image/png", "image/gif", "image/webp"];

function ChangeProfile() {
  const [newProfile, setNewProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); 
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: false,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file && imageFormats.includes(file.type)) {
        setNewProfile(file);
      } else {
        Message("Only image files are allowed!", "warning");
      }
    },
  });

  async function handleformSubmit() {
    if (!newProfile) return Message("Profile image is required", "warning");

    try {
      const existingCookie = Cookies.get("user")
        ? JSON.parse(Cookies.get("user"))
        : {};
      const formData = new FormData();
      formData.append("profileImage", newProfile);
      formData.append("oldprofile", existingCookie?.profile);
      setLoading(true);
      setUploadProgress(0); // Reset progress

      const response = await axios.post(
        `${import.meta.env.VITE_APP_BACKEND_URI}/editprofile`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percent);
          },
        }
      );

      const updatedCookie = {
        ...existingCookie,
        profile: response.data.updatedprofile,
      };
      Cookies.set("user", JSON.stringify(updatedCookie), {
        path: "/",
        expires: 7,
      });

      setLoading(false);
      setUploadProgress(100);
      Message(response.data.message, response.statusText);
      navigate(-1);
      dispatch(setSettingsPageRequest(true));
    } catch (error) {
      setLoading(false);
      Message("Can't upload profile right now ", "error");
    }
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <h1 className="text-2xl font-semibold text-[var(--text)]">Change Profile</h1>

      {/* ✅ Drag & Drop Profile Upload */}
      <div
        {...getRootProps()}
        className={`border rounded-md border-[var(--border)] border-dashed w-48 p-4 flex flex-col items-center justify-center ${
          isDragActive && "border-blue-400"
        }`}
      >
        <input {...getInputProps()} accept="image/*" />
        {newProfile ? (
          <div>
            <img src={URL.createObjectURL(newProfile)} className="w-full" />
            <p className="text-center font-medium text-sm text-[var(--text)]">
              {newProfile.name}
            </p>
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center gap-4">
            <BsCloudUpload className="text-4xl opacity-50 text-[var(--text)]" />
            <p className="text-[var(--text)] font-bold text-center opacity-70">
              Drag & Drop or Click to upload profile
            </p>
          </div>
        )}
      </div>

      {loading && (
          <p className="text-center mt-2 text-sm font-semibold text-gray-700">
            {uploadProgress}% Uploaded
          </p>
      )}
      <button
        className="px-12 py-1 border rounded-lg text-[var(--text)] text-xl font-medium hover:bg-[var(--bg-card)] transition-all duration-75 ease-in border-[var(--border)] active:scale-95"
        onClick={handleformSubmit}
      >
        {loading ? <Loading3 /> : "Submit"}
      </button>
    </div>
  );
}

export default ChangeProfile;
