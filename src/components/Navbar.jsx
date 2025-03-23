import React, { useState, Suspense, useEffect } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { FaPlus } from "react-icons/fa6";
import { IoSettingsOutline } from "react-icons/io5";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { changeTheme, setSettingsPageRequest } from "../reduxstore/slices";
import searchBlogs from "../utility/search";
import Cookies from "js-cookie";
import defaultprofile from "../assets//defaultprofile.png";

const BlogType = React.lazy(() => import("./pages/BlogType"));

function Navbar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showBlogType, setShowBlogType] = useState(false);
  const [moveicons,setMoveIcons] = useState(25);
  const theme = useSelector((state) => state.theme.currentTheme);
  const settingspageopen = useSelector(
    (state) => state.videoPlaying.isSettingsPageRequest
  );
  const [isImgLoading, setIsImgLoading] = useState(true);
  const dispatch = useDispatch();
  const user = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null;

  const handleToggle = () => {
    const newTheme = theme === "dark" ? "bright" : "dark";
    dispatch(changeTheme(newTheme));
  };

  const handleSettingsPage = (e) => {
    e.stopPropagation();
    dispatch(setSettingsPageRequest());
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    const blogs = await searchBlogs(searchTerm);
    setSearchResults(blogs);
    setLoading(false);
  };
  useEffect(()=>{
    if (window.innerWidth>480) setMoveIcons(30)
  },[])
  return (
    <div>
      <nav className="w-full md:h-14 h-12 py-3 px-1 md:px-6 bg-[var(--navbar)] flex md:gap-20 items-center justify-between">
        {/* Logo */}
        <div className="h-14">
          <img
            src="/logosns.png"
            alt="Logo"
            className="aspect-video h-full object-cover"
          />
        </div>

        {/* Search Bar */}
        <div className="md:w-full max-w-[80%] h-full flex gap-6">
          <form
            onSubmit={handleSearch}
            className="relative flex items-center md:bg-[var(--smallcard)] gap-1 p-1 rounded-md h-full"
          >
            <button type="submit">
              <IoSearchOutline className="text-white md:text-[var(--text)] mt-[2px] text-3xl" />
            </button>
            <input
              type="search"
              placeholder="Search blog"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="hidden md:flex items-center border-none focus:outline-none bg-transparent text-[var(--text)]"
            />
          </form>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="absolute top-14 left-1/2 transform -translate-x-1/2 w-80 bg-[var(--smallcard)] border border-gray-600 rounded-md shadow-lg mt-2 z-50">
              {loading ? (
                <p className="text-center text-gray-400 py-2">Loading...</p>
              ) : (
                searchResults.map((result, index) => (
                  <div
                    key={index}
                    className="p-2 hover:bg-gray-800 cursor-pointer"
                  >
                    {result.title}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Other Navbar Buttons */}
        <div className="flex items-center justify-end w-full md:gap-10 gap-6 h-full">
          <button
            className="relative hidden bg-[var(--smallcard)] h-full md:flex justify-center items-center px-3 gap-1 rounded-2xl text-[var(--text)]"
            onClick={() => setShowBlogType(!showBlogType)}
          >
            <FaPlus />
            <span className="h-full flex items-center">Create</span>
            {showBlogType && (
              <Suspense fallback={<div>Loading...</div>}>
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="absolute -bottom-24 z-50"
                >
                  <BlogType setShowBlogType={setShowBlogType} />
                </motion.div>
              </Suspense>
            )}
          </button>

          {/* Theme Toggle */}
          <div
            className={`h-full w-10 md:w-14 bg-[var(--smallcard)] rounded-full flex 
            }`}
            onClick={handleToggle}
          >
            <motion.div
          animate={{x: theme === "bright"? "70%" : 0}}
          transition={{duration:.3, ease:"linear"}}
            
              className={`h-full aspect-square rounded-full ${
                theme === "bright" ? "bg-black" : "bg-white"
              }`}
            ></motion.div>
          </div>

          {/* Profile & Settings */}
          <div
            className="settings bg-[var(--smallcard)] flex items-center rounded-full h-full"
            onClick={handleSettingsPage}
          >
            <button
              className={`text-[var(--text)] h-full flex justify-center items-center px-[2px]  gap-1 rounded-full py-[2px] transition-all duration-1000 ease-linear`}
            >
              <motion.div
                className="relative h-full"
                animate={{x: settingspageopen ? moveicons : 0 }} 
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <img
                  src={user?.profile || defaultprofile}
                  onLoad={() => setIsImgLoading(false)}
                  className="text-sm rounded-full h-full aspect-square"
                />
                {
                  isImgLoading && (<img
                    src={defaultprofile}
                    className="absolute top-0 h-full  rounded-full bg-[red]  blur-sm"
                  />)
                }
              </motion.div>
              <motion.div
                className="relative h-full"
                animate={{ x: settingspageopen ? -moveicons : 0 }} 
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
              <IoSettingsOutline className="flex items-center text-xl md:text-2xl h-full" />
              </motion.div>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
