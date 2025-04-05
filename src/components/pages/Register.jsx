import React, { useState } from "react";
import axios from "axios";
import Message from "../../utility/Message";
import Loading3 from "./Loading3";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(null);
  const [profile, setProfile] = useState("");
  const [coverImg, setCoverImg] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !email || !phoneNo || !password || !profile) {
      Message("All fields are required.", "warning");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_APP_BACKEND_URI}/register`,
        {
          name,
          email,
          phoneNo,
          password,
          profile,
          coverImg,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        Message("Registration successful! Redirecting to login...", "OK");
        setTimeout(() => {
          setLoading(false);
          window.location.href = "/login";
        }, 300);
      } else {
        Message(response.data?.message || "Registration failed.", "error");
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      Message(
        error.response?.data?.message || "Something went wrong.",
        "error"
      );
      setLoading(false);
    }
  };
  return (
    <div className="text-[var(--text)] bg-[var(--bg-body)] h-screen flex items-center justify-center ">
      <div className="bg-[var(--bg-card)]  rounded-md shadow-lg  p-8 backdrop-filter backdrop-blur-md bg-opacity-30 relative">
        <div
          className="absolute top-1 right-1 bg-red-600 w-3 flex items-center justify-center text-white h-3 text-xs pb-[1px] rounded-full hover:bg-red-900 active:scale-95 transition-all duration-75 ease-linear cursor-pointer"
          onClick={() => window.history.back()}
        >
          x
        </div>
        <h1 className="text-4xl font-bold text-center">Register</h1>
        <form onSubmit={handleRegister}>
          <div className="relative my-4">
            <input
              type="file"
              accept="image/*"
              className="block w-72 py-2.5 px-0 text-sm text-[var(--text)] bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder="select profile pic"
              onChange={(e) => setProfile(e.target.files[0])}
            />
            <label className="absolute text-sm duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              profile picture
            </label>
          </div>
          <div className="relative my-4">
            <input
              type="file"
              accept="image/*"
              className="block w-72 py-2.5 px-0 text-sm text-[var(--text)] bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder="select profile pic"
              onChange={(e) => setCoverImg(e.target.files[0])}
            />
            <label className="absolute text-sm duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              cover Image{" "}
            </label>
          </div>

          {/* Name Input */}
          <div className="relative my-4">
            <input
              type="text"
              className="block w-72 py-2.5 px-0 text-sm text-[var(--text)] bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=""
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <label className="absolute text-sm duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Name
            </label>
          </div>

          {/* Email Input */}
          <div className="relative my-4">
            <input
              type="email"
              className="block w-72 py-2.5 px-0 text-sm text-[var(--text)] bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=""
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label className="absolute text-sm duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Email
            </label>
          </div>

          {/* Phone Number Input */}
          <div className="relative my-4">
            <input
              type="text"
              className="block w-72 py-2.5 px-0 text-sm text-[var(--text)] bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=""
              value={phoneNo}
              onChange={(e) => setPhoneNo(e.target.value)}
            />
            <label className="absolute text-sm duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Phone Number
            </label>
          </div>

          {/* Password Input */}
          <div className="relative my-4">
            <input
              type="password"
              className="block w-72 py-2.5 px-0 text-sm text-[var(--text)] bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=""
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label className="absolute text-sm duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Password
            </label>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full mb-5 mt-5 text-[18px] rounded bg-blue-500 py-2 hover:bg-blue-600 transition-colors duration-300 flex justify-center "
          >
            {loading ? <Loading3 /> : "REGISTER"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
