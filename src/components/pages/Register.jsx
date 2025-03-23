import React, { useState } from 'react';
import axios from 'axios';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
const [profile,setProfile] = useState('');
const [coverImg,setCoverImg] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !email || !phoneNo || !password || !profile) {
      setMessage('All fields are required.');
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_APP_BACKEND_URI}/register`, {
        name,
        email,
        phoneNo,
        password,
        profile,
        coverImg,
       
      },{
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    
      console.log(response); 
    
      if (response.data.success) {
        setMessage('Registration successful! Redirecting to login...');
        setTimeout(() => {
          window.location.href = '/login';
        }, 1000);
      } else {
        setMessage(response.data.message || 'Registration failed.');
      }
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.error || 'Something went wrong.');
    }
  }    
  return (
    <div
      className="text-white h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://th.bing.com/th?q=Background+Image+for+Login+Page&w=120&h=120&c=1&rs=1&qlt=90&cb=1&dpr=1.3&pid=InlineBlock&mkt=en-IN&cc=IN&setlang=en&adlt=moderate&t=1&mw=247')",
      }}
    >
      <div className="bg-[#85969bcd] border border-slate-600 rounded-md shadow-lg p-8 backdrop-filter backdrop-blur-md bg-opacity-30 relative">
        <h1 className="text-4xl font-bold text-center">Register</h1>
        <form onSubmit={handleRegister}>
        <div className="relative my-4">
            <input
              type='file'
              accept="image/*"
              className="block w-72 py-2.5 px-0 text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder="select profile pic"
              onChange={(e) => setProfile(e.target.files[0])}
            />
            <label
              className="absolute text-sm duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              profile picture
            </label>
          </div>
          <div className="relative my-4">
            <input
              type='file'
              accept="image/*"
              className="block w-72 py-2.5 px-0 text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder="select profile pic"
              onChange={(e) => setCoverImg(e.target.files[0])}
            />
            <label
              className="absolute text-sm duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
cover Image            </label>
          </div>

          {/* Name Input */}
          <div className="relative my-4">
            <input
              type="text"
              className="block w-72 py-2.5 px-0 text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=""
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <label
              className="absolute text-sm duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Name
            </label>
          </div>

          {/* Email Input */}
          <div className="relative my-4">
            <input
              type="email"
              className="block w-72 py-2.5 px-0 text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=""
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label
              className="absolute text-sm duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Email
            </label>
          </div>

          {/* Phone Number Input */}
          <div className="relative my-4">
            <input
              type="text"
              className="block w-72 py-2.5 px-0 text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=""
              value={phoneNo}
              onChange={(e) => setPhoneNo(e.target.value)}
            />
            <label
              className="absolute text-sm duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Phone Number
            </label>
          </div>

          {/* Password Input */}
          <div className="relative my-4">
            <input
              type="password"
              className="block w-72 py-2.5 px-0 text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=""
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label
              className="absolute text-sm duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Password
            </label>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full mb-5 mt-5 text-[18px] rounded bg-blue-500 py-2 hover:bg-blue-600 transition-colors duration-300"
          >
            REGISTER
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
