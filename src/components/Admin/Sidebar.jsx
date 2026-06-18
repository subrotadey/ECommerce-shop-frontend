// src/components/Admin/Sidebar.jsx
import { NavLink, Link } from "react-router-dom";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { MENU_ITEMS } from "../../config/adminMenu";
import logo from "../../assets/images/logo.png";

const Sidebar = ({ collapsed, toggleCollapse, mobileOpen, closeMobile, userRole }) => {
  const allowed = MENU_ITEMS.filter((item) =>
    item.roles.includes(userRole)
  );

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={closeMobile}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-50 flex flex-col
          border-r border-white/[0.06]
          transition-all duration-300 ease-in-out
          ${collapsed ? "w-[64px]" : "w-[220px]"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo area */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-white/[0.06] flex-shrink-0">
          {!collapsed && (
            <Link to="/" className="flex items-center gap-2 ">
              <img src={logo} alt="Anis Abaya" className="h-7 w-auto" />
                <span className="font-bold text-xl text-black">Anis Abaya</span>
            </Link>
          )}

          {/* Mobile close */}
          <button
            onClick={closeMobile}
            className="lg:hidden p-1.5 rounded-md text-white/40 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>

          {/* Desktop collapse toggle */}
          <button
            onClick={toggleCollapse}
            className="hidden lg:flex p-1.5 rounded-md bg-gray-200  hover:bg-gray-300 transition-colors ml-auto"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 space-y-0.5 px-2 ">
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
                  `group flex items-center gap-3 px-2.5 py-2 rounded-md text-sm 
                   transition-all duration-150 whitespace-nowrap
                   ${isActive
                      ? "bg-[#B8922A]/15 text-[#D4AA4A]"
                      : "text-white/50 hover:text-white hover:bg-white/[0.06]"
                   }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon size={18} className="text-black flex-shrink-0 transition-colors" />
                    {!collapsed && (
                      <span className="font-medium tracking-wide text-black ">{item.label}</span>
                    )}
                    {/* Active indicator */}
                    {isActive && !collapsed && (
                      <div className="ml-auto w-1 h-4 rounded-full bg-[#D4AA4A] opacity-80" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom role badge */}
        {!collapsed && (
          <div className="px-4 py-3 border-t border-white/[0.06]">
            <span
              className={`inline-block px-2.5 py-1 rounded text-xs font-semibold uppercase tracking-wider
                ${userRole === "admin"
                  ? "bg-[#B8922A]/20 text-[#D4AA4A]"
                  : userRole === "manager"
                  ? "bg-blue-500/15 text-blue-400"
                  : "bg-white/10 text-white/60"
                }`}
            >
              {userRole}
            </span>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;