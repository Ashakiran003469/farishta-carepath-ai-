import React from "react";
import { Link, useNavigate } from "react-router-dom";
import FarishtaaLogo from "../components/logo/FarishtaaLogo";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slices/authSlice";
import { clearChat } from "../store/slices/patientSlice";
import { setLanguage } from "../store/slices/languageSlice";
import { CgProfile } from "react-icons/cg";
import { TbShieldCheckeredFilled } from "react-icons/tb";
import { SlLogout } from "react-icons/sl";
import { LuStethoscope } from "react-icons/lu";
import { TiHome } from "react-icons/ti";


const NavBar = () => {
  const dispatch = useDispatch();
  const { isLoggedIn, userId } = useSelector((state) => state.auth);
  const { language } = useSelector((state) => state.language);
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(clearChat());
    dispatch(logout());
    navigate("/");
  };

  return (
    <nav className="top-0 z-50 h-15 w-full bg-white shadow-lg shadow-gray-400">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-1">
          <FarishtaaLogo className="w-10 h-10" />
          <div className="leading-tight flex flex-col">
            <div className="text-lg font-extrabold text-red-600 whitespace-nowrap">फरिश्ता</div>
            <div className="text-gray-500 text-[10px] sm:text-[11px] whitespace-nowrap">Healthcare Companion</div>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link to="/" className="flex items-center gap-1 text-gray-700 hover:text-red-600 transition">
            <TiHome /> Home
          </Link>
          <Link to="/categories" className="flex items-center gap-1 text-gray-700 hover:text-red-600 transition">
            <LuStethoscope /> Consult Doctor
          </Link>
        
            <Link to={`/symptoms/${userId}`} className="flex items-center gap-1 text-gray-700 hover:text-red-600 transition">
            <TbShieldCheckeredFilled /> AI Symptoms Checker
            </Link>
       
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* Language Selector */}
          {isLoggedIn && (
            <select
              value={language}
              onChange={(e) => dispatch(setLanguage(e.target.value))}
              className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-red-500 bg-white"
            >
              <option value="en">🇺🇸 English</option>
              <option value="hi">🇮🇳 हिंदी</option>
              <option value="or">🇮🇳 ଓଡିଆ</option>
            </select>
          )}

          {/* Auth Buttons */}
          {!isLoggedIn ? (
            <>
              <Link
                to="/login"
                className="text-xl text-gray-700 transition-transform hover:scale-105 hover:bg-red-400  transition flex flex-row items-center gap-1 border bg-red-600 text-white px-4 py-2  rounded-xl "
              >
                
                 <span className="font-sans">Login</span>
                  <CgProfile />
              </Link>
            
            </>
          ) : (
            <div className="flex items-center gap-3">
              {/* User Avatar */}
              <div className="w-9 h-9 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-semibold">
                U
              </div>
              {/* Logout */}
              <button
                onClick={handleLogout}
                className="text-sm text-gray-600 hover:text-red-600 transition flex items-center gap-1"
              >
                <SlLogout /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};





export default NavBar;