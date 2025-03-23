import React, {
  useState,
  Suspense,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { IoHomeOutline } from "react-icons/io5";
import { PiVideoDuotone } from "react-icons/pi";
import { PiImagesSquareFill } from "react-icons/pi";
import { GrNewWindow } from "react-icons/gr";
import { MdOutlineAccountCircle } from "react-icons/md";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import cookies from "js-cookie";
const BlogType = React.lazy(() => import("./pages/BlogType"));
function SideNavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showBlogType, setShowBlogType] = useState(false);
  const dropdownRef = useRef(null);
  const [initialAnimation, setInitialAnimation] = useState({ x: -10 });
  const [animate, setAnimate] = useState({ x: 0 });
  const userid = JSON.parse(cookies.get("user") || "null");
  const mySideNavBar = [
    { icon: IoHomeOutline, label: "Home", navigator: "/" },
    { icon: PiVideoDuotone, label: "Videos", navigator: "/videos" },
    { icon: PiImagesSquareFill, label: "Gallery", navigator: "/gallery" },
    { icon: GrNewWindow, label: "New Post", navigator: "/create" },
    { icon: MdOutlineAccountCircle, label: "Profile", navigator: `/user/${userid?._id}` },
  ];

  useEffect(() => {
    if(window.innerWidth<500) {setInitialAnimation({y:10}), setAnimate({y:0})}
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowBlogType(false);
      }
    }

    function handleScroll() {
      setShowBlogType(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleButtonClick = useCallback(
    (label, navigator) => {
      if (label === "New Post") {
        setShowBlogType((prev) => !prev);
      } else {
        setShowBlogType(false);
        navigate(navigator);
      }
    },
    [navigate]
  );

  return (
    <div className="lg:h-screen bg-[var(--navbar)]  lg:w-20 py-2  md:py-4 lg:px-4 flex flex-col">
      <div className="flex justify-between  w-full px-4 md:px-12 lg:px-0 gap-6 lg:flex-col  ">
        {mySideNavBar.map(({ icon: Icon, label, navigator }, index) => {
          const isActive =
            navigator === "/"
              ? location.pathname === navigator
              : location.pathname.startsWith(navigator);

          return (
            <div key={index} className="relative">
              <button
                className={`flex flex-col items-center transition duration-300 ${
                  isActive
                    ? "text-blue-500 font-bold"
                    : "hover:text-gray-800 text-[var(--text)]"
                }`}
                onClick={() => handleButtonClick(label, navigator)}
              >
                <Icon className="w-6  h-6 lg:w-8 lg:h-8" />
                <span className="text-xs md:text-sm line-clamp-1 font-bold lg:mt-1">
                  {label}
                </span>
              </button>

              {label === "New Post" && showBlogType && (
                <Suspense fallback={<div>Loading...</div>}>
                  <motion.div
                    ref={dropdownRef}
                    initial={{ opacity: 0, ...initialAnimation }}
                    animate={{ opacity: 1, ...animate }}
                    exit={{ opacity: 0, ...initialAnimation }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="absolute -left-4 lg:left-12 bottom-14  lg:-top-4  bg-white shadow-lg rounded-md"
                  >
                    <BlogType setShowBlogType={setShowBlogType} />
                  </motion.div>
                </Suspense>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SideNavBar;
