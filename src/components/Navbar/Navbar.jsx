import { ShoppingCart, UserCheck2 } from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import logo from "../../assets/images/logo.png";
import avatar from "../../assets/icons/user.svg";
import { AuthContext } from "../../contexts/AuthContext/AuthContext";
import useCart from "../../hooks/useCart";
import useAuth from "../../hooks/useAuth";

const Navbar = () => {
  const { items, clearCart } = useCart(); // ⭐ clearCart যোগ করুন
  const totalCount = items.reduce((sum, it) => sum + it.qty, 0);

  const navbarRef = useRef(null);
  const [navHeight, setNavHeight] = useState(0);

  const { user} = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (navbarRef.current) {
      setNavHeight(navbarRef.current.offsetHeight);
    }

    const handleResize = () => {
      if (navbarRef.current) {
        setNavHeight(navbarRef.current.offsetHeight);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Abaya", path: "/abaya" },
    { name: "Hijab", path: "/hijab" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" }
  ];

  return (
    <>
      <nav
        ref={navbarRef}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 px-4 md:px-16 lg:px-24 xl:px-32 flex items-center justify-between ${isScrolled
          ? " shadow-md text-gray-950 backdrop-blur-lg py-3 md:py-4"
          : "bg-amber-500 text-white py-3 md:py-4"
          }`}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src={logo}
            alt="logo"
            className={`h-9 transition duration-300 ${isScrolled ? "invert opacity-80" : ""}`}
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-4 lg:gap-8">
          {navLinks.map((link, i) => (
            <Link
              key={i}
              to={link.path}
              className={`group flex flex-col gap-0.5 ${isScrolled ? "text-gray-950 " : "text-white"
                }`}
            >
              {link.name}
              <div
                className={`h-0.5 w-0 group-hover:w-full transition-all duration-300 ${isScrolled ? "bg-gray-700" : "bg-white"
                  }`}
              />
            </Link>
          ))}
        </div>

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-4">
          {/* User Profile */}
          {user?.uid ? (
            <div>
              <label tabIndex={0} className="btn btn-ghost btn-circle border-0 avatar bg-transparent shadow-none">
                <Link to="/dashboard" className="flex items-center justify-center relative cursor-pointer">
                  {/* <img src={user?.photoURL || avatar} alt="profile" /> */}
                  <UserCheck2 className="w-7 h-7" />
                </Link>
              </label>


            </div>
          ) : (
            <Link to="/login">
              <button
                className={`px-8 py-2.5 rounded-full ml-4 transition-all duration-500 cursor-pointer ${isScrolled ? "text-white bg-black" : "bg-white text-black"
                  }`}
              >
                Login

              </button>
            </Link>
          )}

          {/* Shopping Cart Icon */}
          <Link to="/cart" className="relative cursor-pointer">
            <ShoppingCart className="w-7 h-7" />
            {totalCount > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-600 text-white 
                  rounded-full h-5 w-5 flex items-center justify-center 
                  text-xs font-bold">
                {totalCount}
              </div>
            )}
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-3">
          <Link to="/cart" className="relative cursor-pointer">
            <ShoppingCart className="w-6 h-6" />
            {totalCount > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-600 text-white 
                  rounded-full h-4 w-4 flex items-center justify-center 
                  text-xs font-bold">
                {totalCount}
              </div>
            )}
          </Link>

          <svg
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`h-6 w-6 cursor-pointer transition-all duration-500 ${isScrolled ? "text-black" : "text-white"
              }`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`text-black bg-white fixed top-0 left-0 w-full h-screen text-center z-50 py-6 flex flex-col md:hidden items-start px-6 justify-start gap-6 font-medium transition-transform duration-500 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <button className="absolute top-4 right-4" onClick={() => setIsMenuOpen(false)}>
          <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* User Info or Login */}
        {user?.uid ? (
          <div className="text-center w-full flex flex-col items-center">
            <div className="flex items-center gap-3 mt-10">
              <img src={user?.photoURL || avatar} className="w-10 h-10 rounded-full" alt="User" />
            </div>
          </div>
        ) : (
          <Link to="/login" onClick={() => setIsMenuOpen(false)} className="mx-auto">
            <button className="px-6 py-2.5 rounded-full mt-10 bg-indigo-500 text-white">Login</button>
          </Link>
        )}

        {/* Nav Links */}
        <div className="mt-6 flex flex-col gap-4 w-full relative">
          {navLinks.map((link, i) => (
            <Link key={i} to={link.path} onClick={() => setIsMenuOpen(false)} className="hover:underline">
              {link.name}
            </Link>
          ))}
        </div>
      </div>
      <div style={{ height: navHeight }}></div>
    </>
  );
};

export default Navbar;