import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { HiOutlineChat } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import { FaRobot } from "react-icons/fa";

const FloatingAIButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, userId, userType } = useSelector((state) => state.auth);
  const [hovered, setHovered] = useState(false);

  // Hide for doctors, and hide when already on the symptoms/chat page
  if (userType === "Doctor") return null;
  if (location.pathname.includes("/symptoms")) return null;

  const handleClick = () => {
    if (isLoggedIn) {
      navigate(`/symptoms/${userId}`);
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {/* Tooltip */}
      {hovered && (
        <div className="bg-gray-900 text-white text-xs font-medium px-3 py-2 rounded-lg shadow-lg animate-[fadeIn_0.2s_ease-out] whitespace-nowrap">
          AI Symptoms Checker
          <div className="absolute -bottom-1 right-5 w-2 h-2 bg-gray-900 rotate-45"></div>
        </div>
      )}

      {/* Button */}
      <button
        onClick={handleClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="group relative w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-full shadow-lg shadow-red-300/50 hover:shadow-xl hover:shadow-red-400/50 transition-all duration-300 hover:scale-110 flex items-center justify-center"
        aria-label="AI Symptoms Checker"
      >
        {/* Ping animation */}
        <span className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-20"></span>

        <FaRobot size={22} className="relative z-10" />
      </button>
    </div>
  );
};

export default FloatingAIButton;
