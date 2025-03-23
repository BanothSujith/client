import React, { useState, useEffect, useRef } from "react";
import { LuSendHorizontal } from "react-icons/lu";
import { motion } from "framer-motion";
import axios from "axios";

const chatBot = [
  {
    _id: 1,
    sent: "",
    received: "Hello! How may I assist you today?",
  },
];

function ChatBot() {
  const [promt, setPromt] = useState("");
  const [ispromtsend, setPromtsend] = useState(false);
  const [chat, setChat] = useState(chatBot);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTo({
          top: chatContainerRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    }, 100);
  }, [chat]);

  const handlePromtsubmit = async () => {
    if (!promt.trim()) return;

    const newMessage = { _id: chat.length + 1, sent: promt, received: "" };
    setChat((prevChat) => [...prevChat, newMessage]);
    setPromt("");
    setPromtsend(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_BACKEND_URI}/chatbot`,
        { promt },
        { withCredentials: true }
      );

      let fullResponse = response.data.response
        .replace(/\*\*/g, "")
        .replace(/\*/g, "")
        .replace(/\n/g, "\n\n"); 
      let currentIndex = 0;
      const typingInterval = setInterval(() => {
        setChat((prevChat) =>
          prevChat.map((msg, i) =>
            i === prevChat.length - 1
              ? { ...msg, received: fullResponse.slice(0, currentIndex + 1) }
              : msg
          )
        );

        currentIndex++;
        if (currentIndex === fullResponse.length) {
          clearInterval(typingInterval);
          setPromtsend(false);
        }
      },//want typing speed add here no
     );

    } catch (error) {
      console.error("Error fetching chatbot response:", error);
      setPromtsend(false);
    }
  };

  return (
    <div className="flex flex-col justify-between gap-2 bg-[var(--bg-card)] h-96 w-full px-4 py-2">
      <h1 className="text-2xl font-semibold shadow-sm w-full text-center text-[var(--text)]">
        Chat Bot
      </h1>
      <div className="flex flex-col overflow-auto justify-start h-full">
        <div className="overflow-auto scrollbar" ref={chatContainerRef}>
          {chat.map((chat) => (
            <div key={chat._id} className="flex flex-col gap-4 p-2">
              <div className="flex justify-end">
                {chat.sent && (
                  <div className="bg-[#4c38bb] font-medium text-sm text-white p-2 rounded-lg max-w-[70%]">
                    {chat.sent}
                  </div>
                )}
              </div>
              <div className="flex justify-start">
                {chat.received ? (
                  <motion.div
                    className="bg-[#f3f1f1] text-sm text-black font-medium p-2 rounded-lg max-w-[70%]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {chat.received}
                  </motion.div>
                ) : (
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
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <form className="flex w-full items-center gap-8" onSubmit={handlePromtsubmit}>
        
        <input
          type="text"
          placeholder="Ask something here..."
          value={promt}
          onChange={(e) => setPromt(e.target.value)}
          className="w-full h-8 rounded-md border-2 font-medium border-[var(--text)] text-[var(--text)] px-4 outline-none bg-transparent"
        />
        <button
          disabled={ispromtsend}
          onClick={handlePromtsubmit}
          className="cursor-pointer disabled:cursor-not-allowed"
        >
          <LuSendHorizontal className="text-2xl text-[var(--text)]" />
        </button>
      </form>
    </div>
  );
}

export default ChatBot;
