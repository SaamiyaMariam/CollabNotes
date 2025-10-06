import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Dropdown from "./Dropdown";

interface NavbarProps {
  username: string;
}

export default function Navbar({ username }: NavbarProps) {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/auth");
  };

  // Detect scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) setScrolled(true);
      else setScrolled(false);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
    className={`fixed top-1 left-2 right-2 z-50 flex justify-between items-center px-6 py-3 shadow-md rounded-xl transition-all duration-300 ${
            scrolled && !hovered ? "opacity-20" : "opacity-100"
          }`}      
      style={{ background: "linear-gradient(135deg, #f4c3c8, #eb8db5)" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      {/* Brand */}
      <h1
        className="text-2xl font-bold text-white cursor-pointer font-poppins"
        onClick={() => navigate("/app")}
      >
        CollabNotes
      </h1>

      {/* Search */}
      <div className="flex-1 mx-12">
        <input
          type="text"
          placeholder="Search notes..."
          className="w-full max-w-md px-4 py-1.5 rounded-full bg-white/70 shadow-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pinkPurple"
        />
      </div>

      {/* User Dropdown */}
      <Dropdown
        label={
          <div className="flex items-center gap-2">
            <span className="text-white font-medium">{username}</span>
            <div className="w-9 h-9 rounded-full bg-bluePastel flex items-center justify-center shadow">
              <span className="text-white font-bold">{username[0]}</span>
            </div>
          </div>
        }
        options={[
          { label: "Logout", onClick: handleLogout },
        ]}
      />
    </div>
  );
}
