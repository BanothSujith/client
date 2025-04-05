import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import Message from "../../utility/Message";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();

    if (email === "" || password === "") {
      Message("Email and password are required.", "warning");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      Message("Invalid email address.", "warning");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_APP_BACKEND_URI}/login`,
        { email: email.toLowerCase(), password },
        { withCredentials: true }
      );
      const token = response.data.token;
      const user = response.data.user;
      if (token && user) {
        Cookies.set("token", token, {
          expires: 7,
          secure: true,
          sameSite: "None",
        });
        Cookies.set("user", JSON.stringify(user), {
          expires: 7,
          secure: true,
          sameSite: "None",
        });
        window.location.reload();
        Message("Login successful! Redirecting...", "OK");
        setTimeout(() => {
          navigate("/");
        }, 1);
      } else {
        Message("Login successful but no token provided.", "warning");
      }
    } catch (error) {
      Message(error.response?.data?.error, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" h-screen text-[var(--text)] flex items-center justify-center bg-cover bg-center bg-[url('https://your-image-url')]">
      <div className="bg-[var(--bg-card)] border border-slate-600 rounded-md shadow-lg p-8 backdrop-filter backdrop-blur-md bg-opacity-30 relative">
        <div
          className="absolute top-1 right-1 bg-red-600 w-3 flex items-center justify-center text-white h-3 text-xs pb-[1px] rounded-full hover:bg-red-900 active:scale-95 transition-all duration-75 ease-linear cursor-pointer"
          onClick={() => window.history.back()}
        >
          x
        </div>
        <h1 className="text-4xl font-bold text-center">Login</h1>
        <form onSubmit={handleLogin}>
          <div className="relative my-4">
            <input
              type="email"
              className="block w-72 py-2.5 px-0 text-sm  bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=""
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label className="absolute text-sm duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Email
            </label>
          </div>

          <div className="relative my-4">
            <input
              type="password"
              className="block w-72 py-2.5 px-0 text-sm  bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=""
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label className="absolute text-sm duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Password
            </label>
          </div>

          <Link to="/register" className="text-blue-500 hover:underline">
            Create One?
          </Link>

          <button
            type="submit"
            className={`w-full my-5 text-[18px]  rounded bg-blue-500 py-2 hover:bg-blue-600 transition-colors duration-300 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "LOGIN"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
