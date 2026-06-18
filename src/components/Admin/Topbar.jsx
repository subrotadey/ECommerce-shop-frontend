// src/components/Admin/Topbar.jsx
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Bell, LogOut, User, Settings, ChevronDown } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import avatar from "../../assets/icons/user.svg";

const NOTIFICATIONS = [
  { id: 1, text: "New order #ORD-1892 placed", time: "2m ago", unread: true },
  { id: 2, text: "Low stock: Premium Abaya (3 left)", time: "1h ago", unread: true },
  { id: 3, text: "Review pending approval", time: "3h ago", unread: false },
];

const Topbar = ({ onMenuClick, collapsed }) => {
  const { currentUser, logOut } = useAuth();
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const notifRef = useRef(null);
  const userRef = useRef(null);

  const unreadCount = NOTIFICATIONS.filter((n) => n.unread).length;

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (userRef.current && !userRef.current.contains(e.target)) setUserOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    await logOut();
    navigate("/");
  };

  return (
    <header
      className={`
        fixed top-0 right-0 z-30 h-14 flex items-center justify-between
        bg-white border-b border-gray-100 px-4 gap-4
        transition-all duration-300
        ${collapsed ? "left-[64px]" : "left-[220px]"}
        left-0 lg:left-auto
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

      {/* Page title placeholder — can be dynamic via context */}
      <div className="hidden lg:block text-sm font-medium text-gray-500 select-none">
        Admin Panel
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2 ml-auto">
        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => { setNotifOpen((p) => !p); setUserOpen(false); }}
            className="relative p-2 rounded-md text-gray-500 hover:bg-gray-100 transition-colors"
            aria-label="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl border border-gray-100 shadow-lg shadow-black/[0.08] overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-900">Notifications</span>
                <span className="text-xs text-[#B8922A] font-medium cursor-pointer hover:underline">
                  Mark all read
                </span>
              </div>
              <div className="divide-y divide-gray-50 max-h-64 overflow-y-auto">
                {NOTIFICATIONS.map((n) => (
                  <div key={n.id} className="px-4 py-3 flex gap-3 hover:bg-gray-50 transition-colors">
                    <div
                      className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0
                        ${n.unread ? "bg-[#B8922A]" : "bg-gray-200"}`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-800 leading-snug">{n.text}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User menu */}
        <div ref={userRef} className="relative">
          <button
            onClick={() => { setUserOpen((p) => !p); setNotifOpen(false); }}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="User menu"
          >
            <img
              src={currentUser?.photoURL || avatar}
              alt="Avatar"
              className="w-7 h-7 rounded-full object-cover ring-1 ring-gray-200"
              onError={(e) => { e.target.src = avatar; }}
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
              <Link
                to="/admin/settings"
                onClick={() => setUserOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Settings size={15} className="text-gray-400" />
                Settings
              </Link>
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