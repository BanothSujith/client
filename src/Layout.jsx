import { React, lazy, Suspense, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "./components/Navbar";
import SideNavBar from "./components/SideNavBar";
import Routers from "./routes/Routers";
import { setSettingsPageRequest } from "./reduxstore/slices";
import Message from "./components/pages/Message";
import { BsChatTextFill } from "react-icons/bs";

const Settingspage = lazy(() => import("./components/pages/SettingsPage"));
const ChatBot = lazy(() => import("./components/pages/ChatBot"));
const hideNav = ["/login", "/register", "/blogvideo", "/blogimg", "/editprofile"];

function Layout() {
  const location = useLocation();
  const hideLayout = hideNav.includes(location.pathname);
  const isSettingspageOpen = useSelector(
    (state) => state.videoPlaying.isSettingsPageRequest
  );
  const dispatch = useDispatch();
  const isMessage = useSelector((state) => state.videoPlaying.message);
  const messageStatus = useSelector((state) => state.videoPlaying.messageStatus);
  const [chatBot, setChatBot] = useState(false);
  
  const settingsRef = useRef(null);
  const chatBotRef = useRef(null);

  // ✅ Unified function to handle clicks outside both chatbot & settings
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(event.target) &&
        !event.target.closest(".settings")
      ) {
        dispatch(setSettingsPageRequest());
      }
      if (
        chatBotRef.current &&
        !chatBotRef.current.contains(event.target) &&
        !event.target.closest(".chatbot-button")
      ) {
        setChatBot(false);
      }
    };

    if (isSettingspageOpen || chatBot) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSettingspageOpen, chatBot, dispatch]);

  return (
    <div className="w-full h-screen flex flex-col overflow-hidden bg-[var(--bg-body)] transition-all duration-500 ease-linear">
      <div className="w-full">{!hideLayout && <Navbar />}</div>

      <div className="h-full flex flex-col lg:flex-row-reverse justify-center lg:justify-end items-center">
        <div className="relative w-full h-full md:pb-16">
          <Routers />

          <Suspense fallback={<div className="flex items-center justify-center h-full">Loading...</div>}>
            <AnimatePresence>
              {isSettingspageOpen && (
                <motion.div
                  ref={settingsRef}
                  initial={{ x: "100%", opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: "100%", opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeIn" }}
                  className="absolute h-full top-0 right-0 w-fit"
                >
                  <Settingspage />
                </motion.div>
              )}
            </AnimatePresence>
          </Suspense>
        </div>
        <div className="w-full lg:w-fit fixed bottom-0 lg:static">{!hideLayout && <SideNavBar />}</div>
      </div>

      <AnimatePresence>
        {isMessage && (
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ duration: 0.3, ease: "linear" }}
            className="fixed bottom-12 right-4 lg:bottom-3 lg:right-10"
          >
            <Message message={isMessage} type={messageStatus} />
          </motion.div>
        )}

        {/* ✅ Chatbot Button */}
        {!isSettingspageOpen && !hideLayout && (
          <motion.button
            className="text-5xl absolute bottom-0 right-10 chatbot-button"
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: -50, opacity: 1 }}
            transition={{ duration:.3, ease: "linear" }}
            onClick={() => setChatBot((prev) => !prev)}
          >
            <BsChatTextFill className="text-[#4c38bb]" />
          </motion.button>
        )}

        {/* ✅ Chatbot Popup */}
        <Suspense fallback={<div className="flex items-center justify-center h-full">Loading...</div>}>
        <AnimatePresence>
          {chatBot && (
            <motion.div
              ref={chatBotRef}
              initial={{ x:15,scale: 0 }}
              animate={{ x:0,scale: 1 }}
              exit={{x:15,scale: 0 }}
              style={{ transformOrigin: "bottom right" }}
              transition={{ duration: .3, ease: "linear" }}
              className="absolute bottom-12 right-24 w-96 min-h-96 rounded-xl overflow-hidden shadow-lg"
            >
              <ChatBot />
            </motion.div>
          )}
        </AnimatePresence>
        </Suspense>
      </AnimatePresence>
    </div>
  );
}

export default Layout;
