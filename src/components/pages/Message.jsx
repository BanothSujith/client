import React from "react";
import { motion } from "framer-motion";

function Message({ message, type="info" }) {
  const bgColors = {
    OK: "bg-green-200/30 border-green-400 text-green-600",
    error: "bg-red-200/30 border-red-400 text-red-600",
    info: "bg-blue-200/30 border-blue-400 text-blue-600",
    warning: "bg-yellow-200/30 border-yellow-400 text-yellow-600",
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0, scale: 0.95 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: 20, opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`rounded-xl px-6 py-3 max-w-72 text-lg font-medium leading-5 border-1  backdrop-blur-lg ${
        bgColors[type] || bgColors.info
      }`}
    >
      {message}
    </motion.div>
  );
}

export default Message;
