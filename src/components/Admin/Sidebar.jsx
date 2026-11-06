// src/components/Admin/Sidebar.jsx
import { NavLink, Link } from "react-router-dom";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { MENU_ITEMS } from "../../config/adminMenu";
import logo from "../../assets/images/logo.png";

const Sidebar = ({ collapsed, toggleCollapse, mobileOpen, closeMobile, userRole }) => {
  const allowed = MENU_ITEMS.filter((item) => item.roles.includes(userRole));

  // collapsed শুধু ডেস্কটপে (lg) খাটে; মোবাইলে ড্রয়ার সবসময় পূর্ণ প্রস্থে
  const hideWhenCollapsed = collapsed ? "lg:hidden" : "";

  return (
    <>
      {/* Mobile backdrop */}
      <div
        onClick={closeMobile}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 lg:hidden ${
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Sidebar panel */}
      <aside
        aria-label="Admin navigation"
        className={`
          fixed top-0 left-0 z-50 flex h-full flex-col
          w-[260px] max-w-[85vw]
          border-r border-gray-200 bg-white shadow-xl lg:shadow-none
          transition-all duration-300 ease-in-out
          ${collapsed ? "lg:w-[64px]" : "lg:w-[220px]"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo area */}
        <div className="flex h-14 flex-shrink-0 items-center justify-between border-b border-gray-200 px-4">
          <Link
            to="/"
            onClick={closeMobile}
            className={`flex items-center gap-2 ${hideWhenCollapsed}`}
          >
            <img src={logo} alt="Anis Abaya" className="h-7 w-auto" />
            <span className="text-xl font-bold text-gray-900">Anis Abaya</span>
          </Link>

          {/* Mobile close */}
          <button
            onClick={closeMobile}
            className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>

          {/* Desktop collapse toggle */}
          <button
            onClick={toggleCollapse}
            className="ml-auto hidden rounded-md bg-gray-100 p-1.5 text-gray-600 transition-colors hover:bg-gray-200 lg:flex"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto overflow-x-hidden overscroll-contain px-2 py-3">
          {allowed.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.id}
                to={item.path}
                end={item.end}
                onClick={closeMobile}
                title={collapsed ? item.label : undefined}
                className={({ isActive }) =>
                  `group flex items-center gap-3 whitespace-nowrap rounded-md px-2.5 py-2.5 text-sm transition-colors duration-150 ${
                    isActive
                      ? "bg-[#B8922A]/10 text-[#8A6A12]"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon size={18} className="flex-shrink-0" />
                    <span className={`font-medium tracking-wide ${hideWhenCollapsed}`}>
                      {item.label}
                    </span>
                    {isActive && (
                      <div
                        className={`ml-auto h-4 w-1 rounded-full bg-[#B8922A] ${hideWhenCollapsed}`}
                      />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom role badge */}
        <div className={`border-t border-gray-200 px-4 py-3 ${hideWhenCollapsed}`}>
          <span
            className={`inline-block rounded px-2.5 py-1 text-xs font-semibold uppercase tracking-wider ${
              userRole === "admin"
                ? "bg-[#B8922A]/15 text-[#8A6A12]"
                : userRole === "manager"
                ? "bg-blue-50 text-blue-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {userRole}
          </span>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;