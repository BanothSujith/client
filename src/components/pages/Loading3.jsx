import React from 'react'
import { motion } from 'framer-motion'
function Loading3() {
  return (
    <div className="bg-white w-fit px-4 py-3 mx-2 rounded-md flex items-center justify-center gap-1">
    {Array.from({ length: 3 }).map((_, i) => (
      <motion.span
        key={i}
        animate={{ y: [0, -8, 0] }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          repeatDelay: 0.3,
          ease: "easeInOut",
          delay: i * 0.2,
        }}
        className=" bg-black p-1 rounded-full text-white"
      ></motion.span>
    ))}
  </div>  )
}

export default Loading3