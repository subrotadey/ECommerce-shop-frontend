// src/components/Admin/Topbar.jsx
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, LogOut, User, Settings, ChevronDown } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import useRole from "../../hooks/useRole";
import NotificationBell from "../NotificationBell/NotificationBell";
import avatar from "../../assets/icons/user.svg";

const Topbar = ({ onMenuClick, collapsed }) => {
  const { currentUser, logOut } = useAuth();
  const { isAdmin, isStaff } = useRole(currentUser?.email);
  const navigate = useNavigate();
  const [userOpen, setUserOpen] = useState(false);
  const userRef = useRef(null);

  const canSeeNotifications = Boolean(isAdmin || isStaff);

  // বাইরে ক্লিক / Escape চাপলে ইউজার মেনু বন্ধ
  useEffect(() => {
    if (!userOpen) return;
    const onDown = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) setUserOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setUserOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [userOpen]);

  const handleLogout = async () => {
    try {
      await logOut();
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      navigate("/");
    }
  };

  return (
    <header
      className={`
        fixed top-0 right-0 left-0 z-30 flex h-14 items-center justify-between gap-4
        border-b border-gray-100 bg-white px-4
        transition-all duration-300
        ${collapsed ? "lg:left-[64px]" : "lg:left-[220px]"}
      `}
    >
      {/* Left: Hamburger (mobile) */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100 transition-colors"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      <div className="hidden lg:block text-sm font-medium text-gray-500 select-none">
        Admin Panel
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2 ml-auto">
        {/* Notifications (Admin/Staff শেয়ার্ড ইনবক্স) */}
                <NotificationBell
          scope="staff"
          enabled={canSeeNotifications}
          panelClassName="-right-[5rem] sm:right-0"
        />

        {/* User menu */}
        <div ref={userRef} className="relative">
          <button
            onClick={() => setUserOpen((p) => !p)}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="User menu"
            aria-expanded={userOpen}
          >
            <img
              src={currentUser?.photoURL || avatar}
              alt="Avatar"
              className="w-7 h-7 rounded-full object-cover ring-1 ring-gray-200"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = avatar;
              }}
            />
            <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-[100px] truncate">
              {currentUser?.displayName?.split(" ")[0] || "Admin"}
            </span>
            <ChevronDown size={14} className="text-gray-400" />
          </button>

          {userOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl border border-gray-100 shadow-lg shadow-black/[0.08] overflow-hidden z-50 py-1">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {currentUser?.displayName || "Admin"}
                </p>
                <p className="text-xs text-gray-400 truncate">{currentUser?.email}</p>
              </div>

              {isAdmin && (
                <Link
                  to="/admin/settings"
                  onClick={() => setUserOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Settings size={15} className="text-gray-400" />
                  Settings
                </Link>
              )}

              <Link
                to="/profile"
                onClick={() => setUserOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <User size={15} className="text-gray-400" />
                Profile
              </Link>

              <div className="border-t border-gray-100 mt-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={15} />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;