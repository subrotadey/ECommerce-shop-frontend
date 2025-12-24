import { Heart, ShoppingCart, LogOut, User, Shield, Settings } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import avatar from "../../assets/icons/user.svg";
import useCart from "../../hooks/useCart";
import useAuth from "../../hooks/useAuth";
import useWishlist from "../../hooks/useWishlist";
import useRole from "../../hooks/useRole";

const Navbar = () => {
  const { items } = useCart();
  const { wishlistCount } = useWishlist();
  const { currentUser, logOut } = useAuth();
  const { role, isAdmin, isStaff } = useRole(currentUser?.email);
  const totalCount = items.reduce((sum, it) => sum + it.qty, 0);

  const navbarRef = useRef(null);
  const [navHeight, setNavHeight] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();

  // Calculate navbar height
  useEffect(() => {
    const updateHeight = () => {
      if (navbarRef.current) {
        setNavHeight(navbarRef.current.offsetHeight);
      }
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen]);

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/');
      setShowUserMenu(false);
      setIsMenuOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Abaya", path: "/abaya" },
    { name: "Hijab", path: "/hijab" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" }
  ];

  // Role badge component
  const RoleBadge = () => {
    if (isAdmin) {
      return (
        <span className="px-2 py-0.5 text-xs font-semibold bg-red-100 text-red-700 rounded-full">
          Admin
        </span>
      );
    }
    if (isStaff) {
      return (
        <span className="px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full">
          Staff
        </span>
      );
    }
    return null;
  };

  return (
    <>
      <nav
        ref={navbarRef}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 px-4 md:px-8 lg:px-16 xl:px-24 flex items-center justify-between ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg text-gray-900 py-3"
            : "bg-amber-500 text-white py-4"
        }`}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 z-10">
          <img
            src={logo}
            alt="Anis Abaiya"
            className={`h-8 md:h-9 transition-all duration-300 ${
              isScrolled ? "invert brightness-0" : ""
            }`}
          />
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="group relative text-sm lg:text-base font-medium transition-colors duration-200 hover:opacity-80"
            >
              {link.name}
              <span
                className={`absolute -bottom-1 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-300 ${
                  isScrolled ? "bg-gray-900" : "bg-white"
                }`}
              />
            </Link>
          ))}
        </div>

        {/* Desktop Right Side */}
        <div className="hidden md:flex items-center gap-4 lg:gap-5">
          {/* Wishlist */}
          <Link
            to="/wishlist"
            className="relative group p-2 hover:bg-black/5 rounded-full transition-all"
            title="Wishlist"
          >
            <Heart
              className={`w-5 h-5 lg:w-6 lg:h-6 transition-all duration-200 ${
                isScrolled
                  ? "text-gray-700 group-hover:text-red-600 group-hover:fill-red-600"
                  : "text-white group-hover:text-red-600 group-hover:fill-red-600"
              }`}
            />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center">
                {wishlistCount > 9 ? "9+" : wishlistCount}
              </span>
            )}
          </Link>

          {/* Shopping Cart */}
          <Link
            to="/cart"
            className="relative group p-2 hover:bg-black/5 rounded-full transition-all"
            title="Shopping Cart"
          >
            <ShoppingCart
              className={`w-5 h-5 lg:w-6 lg:h-6 transition-colors duration-200 ${
                isScrolled ? "text-gray-700" : "text-white"
              }`}
            />
            {totalCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center">
                {totalCount > 9 ? "9+" : totalCount}
              </span>
            )}
          </Link>

          {/* User Menu */}
          {currentUser?.uid ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={`flex items-center gap-2 p-2 rounded-full hover:bg-black/5 transition-all ${
                  isScrolled ? "text-gray-900" : "text-white"
                }`}
              >
                <img
                  src={currentUser?.photoURL || avatar}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover border-2 border-current"
                />
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl py-2 border border-gray-100 animate-fadeIn">
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="font-semibold text-gray-900 truncate">
                      {currentUser?.displayName || "User"}
                    </p>
                    <p className="text-sm text-gray-500 truncate mb-2">
                      {currentUser?.email}
                    </p>
                    <RoleBadge />
                  </div>

                  {/* Profile Link */}
                  <Link
                    to="/profile"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <User size={18} />
                    <span>My Profile</span>
                  </Link>

                  {/* Admin/Staff Dashboard - শুধুমাত্র admin/staff দেখবে */}
                  {(isAdmin || isStaff) && (
                    <Link
                      to="/admin"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-blue-600 hover:bg-blue-50 transition-colors"
                    >
                      <Shield size={18} />
                      <span>{isAdmin ? 'Admin Dashboard' : 'Staff Dashboard'}</span>
                    </Link>
                  )}

                  {/* Settings */}
                  <Link
                    to="/settings"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Settings size={18} />
                    <span>Settings</span>
                  </Link>

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100 mt-2"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login">
              <button
                className={`px-6 lg:px-8 py-2 lg:py-2.5 rounded-full font-medium transition-all duration-300 hover:opacity-90 ${
                  isScrolled
                    ? "bg-gray-900 text-white hover:bg-gray-800"
                    : "bg-white text-gray-900 hover:bg-gray-100"
                }`}
              >
                Login
              </button>
            </Link>
          )}
        </div>

        {/* Mobile Right Side */}
        <div className="flex md:hidden items-center gap-3">
          {/* Wishlist */}
          <Link
            to="/wishlist"
            className="relative p-2"
            onClick={() => setIsMenuOpen(false)}
          >
            <Heart
              className={`w-5 h-5 transition-colors ${
                isScrolled ? "text-gray-700" : "text-white"
              }`}
            />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center">
                {wishlistCount > 9 ? "9+" : wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            className="relative p-2"
            onClick={() => setIsMenuOpen(false)}
          >
            <ShoppingCart
              className={`w-5 h-5 transition-colors ${
                isScrolled ? "text-gray-700" : "text-white"
              }`}
            />
            {totalCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center">
                {totalCount > 9 ? "9+" : totalCount}
              </span>
            )}
          </Link>

          {/* Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`p-2 transition-colors ${
              isScrolled ? "text-gray-900" : "text-white"
            }`}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="18" x2="20" y2="18" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 left-0 w-[85%] max-w-sm h-screen bg-white z-50 md:hidden transition-transform duration-300 ease-out ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } shadow-2xl`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-amber-500 text-white">
            <img src={logo} alt="Logo" className="h-8 invert" />
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Close menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* User Section */}
          <div className="p-4 border-b bg-gray-50">
            {currentUser?.uid ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={currentUser?.photoURL || avatar}
                    alt="Profile"
                    className="w-12 h-12 rounded-full object-cover border-2 border-amber-500"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">
                      {currentUser?.displayName || "User"}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {currentUser?.email}
                    </p>
                  </div>
                </div>
                <RoleBadge />
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="block w-full"
              >
                <button className="w-full px-6 py-3 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 transition-colors">
                  Login
                </button>
              </Link>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto py-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className="block px-6 py-3 text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-colors font-medium"
              >
                {link.name}
              </Link>
            ))}

            {currentUser?.uid && (
              <>
                <Link
                  to="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-6 py-3 text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-colors font-medium border-t mt-2 pt-4"
                >
                  My Profile
                </Link>

                {/* Admin/Staff Dashboard - conditional */}
                {(isAdmin || isStaff) && (
                  <Link
                    to="/admin"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-6 py-3 text-blue-600 hover:bg-blue-50 transition-colors font-medium flex items-center gap-2"
                  >
                    <Shield size={18} />
                    {isAdmin ? 'Admin Dashboard' : 'Staff Dashboard'}
                  </Link>
                )}

                <Link
                  to="/settings"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-6 py-3 text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-colors font-medium"
                >
                  Settings
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-6 py-3 text-red-600 hover:bg-red-50 transition-colors font-medium"
                >
                  Logout
                </button>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* Spacer */}
      <div style={{ height: navHeight }} />
    </>
  );
};

export default Navbar;