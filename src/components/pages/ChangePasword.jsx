import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Message from "../../utility/Message";
import axios from "axios";

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      Message("New passwords do not match.", "warning");
      return;
    }
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_BACKEND_URI}/changepassword`,
        { oldPassword, newPassword },
        { withCredentials: true }
      );
      Message(response.data?.message, response.statusText);
    } catch (error) {
      if (error.response?.data?.message) {
        Message(error.response?.data?.message, "error");
      }
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-[var(--bg-body)] text-[var(--text)]">
      <form
        onSubmit={handleSubmit}
        className="relative bg-[var(--bg-card)] p-6 rounded-lg shadow-md w-96 space-y-4"
      >
        <h2 className="text-2xl font-semibold text-center">Change Password</h2>

        {/* Old Password */}
        <div className="relative">
          <label className="block font-medium">Old Password</label>
          <input
            type={showPassword.old ? "text" : "password"}
            className="w-full border p-2 rounded mt-1 text-[var(--text)] bg-transparent focus-within:bg-[var(--bg-body)]"
            placeholder="Enter old password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
          <span
            className="absolute right-3 top-10 cursor-pointer text-xl"
            onClick={() => togglePasswordVisibility("old")}
          >
            {showPassword.old ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* New Password */}
        <div className="relative">
          <label className="block font-medium">New Password</label>
          <input
            type={showPassword.new ? "text" : "password"}
            className="w-full border p-2 rounded mt-1 text-[var(--text)] bg-transparent focus-within:bg-[var(--bg-body)]"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <span
            className="absolute right-3 top-10 cursor-pointer text-xl"
            onClick={() => togglePasswordVisibility("new")}
          >
            {showPassword.new ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <label className="block font-medium">Confirm New Password</label>
          <input
            type={showPassword.confirm ? "text" : "password"}
            className="w-full border p-2 rounded mt-1 text-[var(--text)] bg-transparent focus-within:bg-[var(--bg-body)]"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <span
            className="absolute right-3 top-10 cursor-pointer text-xl"
            onClick={() => togglePasswordVisibility("confirm")}
          >
            {showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
        >
          Change Password
        </button>
        <div className="absolute -top-3 right-1 bg-red-600 w-3 flex items-center justify-center text-white h-3 text-xs pb-[1px] rounded-full hover:bg-red-900 active:scale-95 transition-all duration-75 ease-linear cursor-pointer" onClick={()=>window.history.back()}>
          x
        </div>
      </form>
    </div>
  );
}

export default ChangePassword;
