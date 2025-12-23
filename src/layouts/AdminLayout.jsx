// ============================================
// layouts/AdminLayout.jsx - FIXED VERSION
// ============================================
import { Outlet, NavLink, useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { LayoutDashboard, Package, ShoppingCart, Users, BarChart3, Tag, Star, Settings, Menu, X, LogOut, Bell, ChevronDown, UserCircle2, Ticket, UserCog } from "lucide-react";
import useAuth from "../hooks/useAuth";
import useCart from "../hooks/useCart";

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const { user, logOut } = useAuth();
    const navigate = useNavigate();

    const handleLogOut = async () => {
        try {
            await logOut();
            navigate('/');
        } catch (err) {
            console.error("Logout error:", err);
        }
    };

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
        { icon: Package, label: 'Products', path: '/admin/products' },
        { icon: ShoppingCart, label: 'Orders', path: '/admin/orders' },
        { icon: Users, label: 'Customers', path: '/admin/customers' },
        { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
        { icon: Tag, label: 'Categories', path: '/admin/categories' },
        { icon: Ticket, label: 'Coupons', path: '/admin/coupons' },
        { icon: Star, label: 'Reviews', path: '/admin/reviews' },
        { icon: UserCog, label: 'Staff', path: '/admin/staff' },
        { icon: Settings, label: 'Settings', path: '/admin/settings' },
    ];

    // Sample notifications - Replace with real data
    const notifications = [
        { id: 1, title: 'New order #1234', time: '2 minutes ago', unread: true },
        { id: 2, title: 'Low stock alert', time: '1 hour ago', unread: true },
        { id: 3, title: 'Customer review received', time: '3 hours ago', unread: false },
    ];

    const unreadCount = notifications.filter(n => n.unread).length;

    return (
        <div className="flex h-screen bg-white">
            {/* Sidebar */}
            <aside
                className={`${sidebarOpen ? 'w-60 ' : 'w-20'
                    } bg-white transition-all duration-300 flex flex-col border-r border-gray-200`}
            >
                {/* Logo */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
                    {sidebarOpen && (
                        <Link to="/" className="">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                    <LayoutDashboard className="w-6 h-6" />
                                </div>
                                <span className="text-xl font-bold">Anis Abaya</span>
                            </div>
                        </Link>
                    )}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="btn btn-ghost btn-sm btn-circle"
                        aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
                    >
                        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-4">
                    <ul className="menu">
                        {menuItems.map((item) => (
                            <li key={item.path}>
                                <NavLink
                                    to={item.path}
                                    end={item.path === '/admin'}
                                    className={({ isActive }) =>
                                        `${isActive ? 'active' : ''} ${!sidebarOpen && 'tooltip tooltip-right'}`
                                    }
                                    data-tip={!sidebarOpen ? item.label : undefined}
                                    aria-label={item.label}
                                >
                                    <item.icon size={20} />
                                    {sidebarOpen && <span>{item.label}</span>}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* User Info */}
                <div className="p-4 border-t border-gray-200">
                    {sidebarOpen ? (
                        <div className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 border border-gray-200">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-white font-bold text-lg">
                                    {user?.name?.[0]?.toUpperCase() || 'A'}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {user?.name || 'Admin User'}
                                </p>
                                <p className="text-xs text-gray-600 truncate">
                                    {user?.email || 'admin@gmail.com'}
                                </p>
                            </div>
                            <button
                                className="btn btn-ghost bg-gradient-to-r from-blue-50 to-purple-50 border-none shadow-none text-gray-500 hover:text-red-600 transition-colors flex-shrink-0"
                                onClick={handleLogOut}
                                aria-label="Logout"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex justify-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-lg">
                                    {user?.name?.[0]?.toUpperCase() || 'A'}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden bg-white">
                {/* Top Navbar */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
                    <div className="flex-1">
                        <h2 className="text-lg font-semibold text-gray-900">Admin Dashboard</h2>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Notifications Dropdown */}
                        <div className="dropdown dropdown-end">
                            <button
                                className="btn btn-ghost btn-circle"
                                onClick={() => setNotificationsOpen(!notificationsOpen)}
                                aria-label="Notifications"
                            >
                                <div className="indicator">
                                    <Bell size={20} />
                                    {unreadCount > 0 && (
                                        <span className="badge badge-xs badge-primary indicator-item">
                                            {unreadCount}
                                        </span>
                                    )}
                                </div>
                            </button>
                            {notificationsOpen && (
                                <div
                                    className="dropdown-content mt-3 z-[1] card card-compact w-80 bg-white shadow-lg border border-gray-200 rounded-lg"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div className="card-body">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-semibold text-gray-900">Notifications</h3>
                                            {unreadCount > 0 && (
                                                <button className="text-xs text-primary hover:underline">
                                                    Mark all as read
                                                </button>
                                            )}
                                        </div>
                                        <div className="space-y-2 max-h-96 overflow-y-auto">
                                            {notifications.length > 0 ? (
                                                notifications.map((notification) => (
                                                    <div
                                                        key={notification.id}
                                                        className={`p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors ${notification.unread ? 'bg-blue-50/50 border border-blue-100' : 'border border-transparent'
                                                            }`}
                                                    >
                                                        <div className="flex items-start justify-between gap-2">
                                                            <p className="text-sm font-medium text-gray-900 flex-1">
                                                                {notification.title}
                                                            </p>
                                                            {notification.unread && (
                                                                <div className="w-2 h-2 bg-primary rounded-full mt-1 flex-shrink-0"></div>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-gray-600 mt-1">{notification.time}</p>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-sm text-center text-gray-500 py-8">
                                                    No notifications
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* User Menu Dropdown */}
                        <div className="dropdown dropdown-end">
                            <button
                                className="btn btn-ghost gap-2"
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                aria-label="User menu"
                            >
                                <UserCircle2 size={20} />
                                <span className="hidden md:inline">{user?.name || 'Admin'}</span>
                                <ChevronDown size={16} />
                            </button>
                            {userMenuOpen && (
                                <ul
                                    className="dropdown-content menu mt-3 z-[1] p-2 shadow-lg bg-white rounded-box w-52 border border-gray-200"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <li>
                                        <NavLink
                                            to="/admin/settings"
                                            onClick={() => setUserMenuOpen(false)}
                                            className="hover:bg-gray-100"
                                        >
                                            <Settings size={16} /> Settings
                                        </NavLink>
                                    </li>
                                    <li>
                                        <a
                                            onClick={() => {
                                                setUserMenuOpen(false);
                                                handleLogOut();
                                            }}
                                            className="hover:bg-gray-100 text-red-600"
                                        >
                                            <LogOut size={16} /> Logout
                                        </a>
                                    </li>
                                </ul>
                            )}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;