import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import Message from "../../utility/Message";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();

    if (email === "" || password === "") {
      setMessage("Email and password are required.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setMessage("Invalid email address.");
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
      console.log("token", token)
      if (token && user) {
        Cookies.set('token', token, { expires:7 ,secure:true, sameSite: 'None', });
        Cookies.set('user', JSON.stringify(user),{expires:7 ,secure:true, sameSite: 'None',});
        setMessage('Login successful! Redirecting...');
        setTimeout(() => {
          navigate("/");
        }, 1);
      } else {
        setMessage("Login successful but no token provided.");
        Message("Login successful but no token provided." , "warning");
      }

    } catch (error) {
      setMessage(error.response?.data?.error || "Something went wrong.");
       Message(error.response?.data?.error , "error");
    } finally {
      setLoading(false);
    }

  };

  return (
    <div className="text-white h-screen flex items-center justify-center bg-cover bg-center bg-[url('https://your-image-url')]">
      <div className="bg-[#85969bcd] border border-slate-600 rounded-md shadow-lg p-8 backdrop-filter backdrop-blur-md bg-opacity-30 relative">
        <h1 className="text-4xl font-bold text-center">Login</h1>
        <form onSubmit={handleLogin}>
          <div className="relative my-4">
            <input
              type="email"
              className="block w-72 py-2.5 px-0 text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
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
              className="block w-72 py-2.5 px-0 text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
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
            className={`w-full mb-5 mt-5 text-[18px] rounded bg-blue-500 py-2 hover:bg-blue-600 transition-colors duration-300 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "LOGIN"}
          </button>
        </form>
        {message && <p className="text-red-500 text-center mt-3">{message}</p>}
      </div>
    </div>
  );
}

export default Login;
