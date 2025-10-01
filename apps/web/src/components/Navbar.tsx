import { useNavigate } from "react-router-dom";

interface NavbarProps {
  username: string;
}

export default function Navbar({ username }: NavbarProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/auth");
  };

  return (
    <div className="flex justify-between items-center px-8 py-4 bg-white shadow-sm">
      {/* App Name */}
      <h1
        className="text-2xl font-bold text-teal-700 cursor-pointer"
        onClick={() => navigate("/dashboard")}
      >
        CollabNotes
      </h1>

      {/* User Info + Logout */}
      <div className="flex items-center gap-4">
        <span className="text-gray-700 font-medium">{username}</span>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-500 hover:text-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
