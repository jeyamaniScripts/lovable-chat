import { useState } from "react";
import ProfileMenu from "./ProfileMenu";
import { ChatState } from "../context/ChatProvider";
import { useNavigate } from "react-router-dom";

const TopBar = ({ onSearch, onProfile }) => {
  const [openMenu, setOpenMenu] = useState(false);
  const { user } = ChatState();
  console.log(user);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  return (
    <div className="relative flex items-center justify-between px-6 py-3 border-b bg-white">
      {/* 🔍 Search Bar */}
      <div
        onClick={onSearch}
        className="
          flex items-center gap-2
          border border-gray-300 rounded-md
          px-3 py-1.5
          cursor-pointer
          text-gray-500
          hover:border-primary
          transition
        "
      >
        <span>🔍</span>
        <span className="text-sm text-gray-400">Search User</span>
      </div>

      {/* Title */}
      <h1 className="font-semibold text-lg text-primary">Talk-A-Tive</h1>

      {/* Right Section */}
      <div className="relative flex items-center gap-5">
        {/* 🔔 Notification */}
        <button className="relative text-gray-600 hover:text-primary transition">
          🔔
          {/* Notification dot */}
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* 👤 Profile + Dropdown */}
        <div
          className="flex items-center gap-1 cursor-pointer"
          onClick={() => setOpenMenu(!openMenu)}
        >
          <img
            src="https://i.pravatar.cc/40"
            className="w-8 h-8 rounded-full"
            alt="profile"
          />

          {/* ⬇️ Dropdown Arrow */}
          <svg
            className={`w-4 h-4 text-gray-600 transition-transform ${
              openMenu ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>

        {/* Dropdown Menu */}
        {openMenu && (
          <ProfileMenu
            onProfile={() => {
              setOpenMenu(false);
              onProfile();
            }}
            onLogout={() => {
              setOpenMenu(false);
              handleLogout();
              alert("Logout");
            }}
          />
        )}
      </div>
    </div>
  );
};

export default TopBar;
