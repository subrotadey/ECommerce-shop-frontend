// src/layouts/AdminLayout.jsx
import { Outlet } from "react-router-dom";
import { useSidebar } from "../hooks/useSidebar";
import Sidebar from "../components/Admin/Sidebar";
import Topbar from "../components/Admin/Topbar";
import useAuth from "../hooks/useAuth";
import useRole from "../hooks/useRole";
import Loading from "../components/Shared/Loading/Loading";
import TokenDebugger from "../components/Debug/TokenDebugger";

const AdminLayout = () => {
  const { collapsed, toggleCollapse, mobileOpen, openMobile, closeMobile } = useSidebar();
  const { currentUser } = useAuth();
  const { role, isLoading } = useRole(currentUser?.email);

  if (isLoading) return <Loading />;

  const userRole = role || "staff";

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        collapsed={collapsed}
        toggleCollapse={toggleCollapse}
        mobileOpen={mobileOpen}
        closeMobile={closeMobile}
        userRole={userRole}
      />

      {/* Main area shifts right based on sidebar width */}
      <div
        className={`
          flex-1 flex flex-col min-w-0
          transition-all duration-300
          ${collapsed ? "lg:ml-[64px]" : "lg:ml-[220px]"}
        `}
      >
        <Topbar
          onMenuClick={openMobile}
          collapsed={collapsed}
        />

        {/* Content — below topbar */}
        <main className="flex-1 pt-14 p-6 overflow-y-auto">
          <Outlet />
          <TokenDebugger />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;