
import {
  Heart,
  ShoppingCart,
  LogOut,
  User,
  Shield,
  Settings,
  LayoutDashboard,
  Menu,
  X,
  ChevronRight,
  Package,
  Home,
  Info,
  Phone,
  ShoppingBag,
  Crown,
  UserCog,
  CircleUser,
} from "lucide-react";

import { useEffect, useRef, useState, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import logo from "../../assets/images/logo.png";
import avatar from "../../assets/icons/user.svg";

import useCart from "../../hooks/useCart";
import useAuth from "../../hooks/useAuth";
import useWishlist from "../../hooks/useWishlist";
import useRole from "../../hooks/useRole";

// ─── Theme ────────────────────────────────────────────────────────────────
// Deep Emerald: #123C32
// Champagne Gold: #D4AF37
// Warm Ivory: #F7F5EF
// Charcoal: #1A1A1A

const NAV_LINKS = [
  { name: "Home", path: "/", icon: Home },
  { name: "Abaya", path: "/abaya", icon: ShoppingBag },
  { name: "Hijab", path: "/hijab", icon: ShoppingBag },
  { name: "About", path: "/about", icon: Info },
  { name: "Contact", path: "/contact", icon: Phone },
];

// ─── Small components ────────────────────────────────────────────────────

const Badge = ({ count }) =>
  count > 0 ? (
    <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-white bg-[#D4AF37] px-1 text-[9px] font-bold leading-none text-[#123C32] shadow-sm">
      {count > 9 ? "9+" : count}
    </span>
  ) : null;

const RolePill = ({ isAdmin, isStaff }) => {
  const role = isAdmin
    ? {
        label: "Admin",
        Icon: Crown,
        className: "bg-amber-50 text-amber-700 border-amber-200",
      }
    : isStaff
    ? {
        label: "Staff",
        Icon: UserCog,
        className: "bg-emerald-50 text-emerald-700 border-emerald-200",
      }
    : {
        label: "Customer",
        Icon: User,
        className: "bg-stone-100 text-stone-600 border-stone-200",
      };

  const Icon = role.Icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${role.className}`}
    >
      <Icon size={11} />
      {role.label}
    </span>
  );
};

const IconButton = ({ to, label, children, count }) => (
  <Link
    to={to}
    aria-label={label}
    title={label}
    className="relative flex h-10 w-10 items-center justify-center rounded-full text-[#123C32] transition-all duration-200 hover:bg-[#F7F5EF] hover:text-[#A98216] active:scale-95"
  >
    {children}
    <Badge count={count} />
  </Link>
);

// ─── Main Navbar ─────────────────────────────────────────────────────────

const Navbar = () => {
  const { items = [] } = useCart();
  const { wishlistCount = 0 } = useWishlist();
  const { currentUser, logOut } = useAuth();
  const { isAdmin, isStaff } = useRole(currentUser?.email);

  const totalCount = items.reduce((total, item) => total + (item.qty || 0), 0);

  const location = useLocation();
  const navigate = useNavigate();

  const navbarRef = useRef(null);
  const userMenuRef = useRef(null);
  const hoverTimeout = useRef(null);
  const lastScrollY = useRef(0);
  const previousOverflow = useRef("");

  const [navHeight, setNavHeight] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileProfileOpen, setMobileProfileOpen] = useState(false);

  const closeAllPanels = useCallback(() => {
    setMenuOpen(false);
    setProfileOpen(false);
    setMobileProfileOpen(false);
  }, []);

  // Close menus after route changes
  useEffect(() => {
    closeAllPanels();
  }, [location.pathname, closeAllPanels]);

  // Navbar height observer
  useEffect(() => {
    const element = navbarRef.current;
    if (!element) return;

    const updateHeight = () => {
      const height = element.offsetHeight;
      setNavHeight(height);
      document.documentElement.style.setProperty(
        "--navbar-height",
        `${height}px`
      );
    };

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(element);

    window.addEventListener("resize", updateHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, [isScrolled]);

  // Hide navbar while scrolling down, show while scrolling up
  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      const difference = currentY - lastScrollY.current;

      setIsScrolled(currentY > 8);

      if (currentY < 80) {
        setIsVisible(true);
      } else if (difference > 4) {
        setIsVisible(false);
      } else if (difference < -4) {
        setIsVisible(true);
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while mobile panels are open
  useEffect(() => {
  const shouldLock = menuOpen || mobileProfileOpen;

  if (!shouldLock) return;

  const previousOverflow = document.body.style.overflow;
  document.body.style.overflow = "hidden";

  return () => {
    document.body.style.overflow = previousOverflow;
  };
}, [menuOpen, mobileProfileOpen]);

  // Close desktop dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // Escape key closes all menus
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") closeAllPanels();
    };

    document.addEventListener("keydown", handleEscape);

    return () => document.removeEventListener("keydown", handleEscape);
  }, [closeAllPanels]);

  // Clean up hover timer
  useEffect(() => {
    return () => clearTimeout(hoverTimeout.current);
  }, []);

  const onProfileEnter = useCallback(() => {
    clearTimeout(hoverTimeout.current);
    setProfileOpen(true);
  }, []);

  const onProfileLeave = useCallback(() => {
    clearTimeout(hoverTimeout.current);
    hoverTimeout.current = setTimeout(() => {
      setProfileOpen(false);
    }, 180);
  }, []);

  const handleLogout = async () => {
    try {
      clearTimeout(hoverTimeout.current);
      await logOut();
      closeAllPanels();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const isActive = (path) =>
    path === "/"
      ? location.pathname === "/"
      : location.pathname === path ||
        location.pathname.startsWith(`${path}/`);

  const profileName = currentUser?.displayName?.split(" ")[0] || "Account";

  return (
    <>
      {/* ─── MAIN NAVBAR ─────────────────────────────────────────────── */}
      <nav
        ref={navbarRef}
        className={`fixed left-0 top-0 z-[100] w-full border-b border-[#D4AF37]/20 bg-white/95 backdrop-blur-xl transition-all duration-300 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        } ${
          isScrolled
            ? "py-2 shadow-[0_4px_24px_rgba(18,60,50,0.08)]"
            : "py-3 shadow-sm"
        }`}
      >
        <div className="mx-auto flex w-full max-w-screen-xl items-center justify-between gap-2 px-3 sm:px-5 md:px-8">

          {/* Left: Mobile menu */}
          <div className="flex flex-1 items-center md:flex-none">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={menuOpen}
              className="btn btn-ghost btn-circle border-0 text-[#123C32] hover:bg-[#F7F5EF] md:hidden"
            >
              <Menu size={22} />
            </button>

            {/* Desktop logo */}
            <Link
              to="/"
              className="hidden items-center md:flex"
              aria-label="Anis Abaya Home"
            >
              <img
                src={logo}
                alt="Anis Abaya"
                className={`w-auto object-contain transition-all duration-300 ${
                  isScrolled ? "h-9" : "h-10"
                }`}
              />
            </Link>
          </div>

          {/* Mobile centered logo */}
          <Link
            to="/"
            className="absolute left-1/2 flex -translate-x-1/2 items-center md:hidden"
            aria-label="Anis Abaya Home"
          >
            <img
              src={logo}
              alt="Anis Abaya"
              className="h-8 w-auto object-contain"
            />
          </Link>

          {/* Desktop navigation */}
          <div className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map(({ name, path }) => {
              const active = isActive(path);

              return (
                <Link
                  key={path}
                  to={path}
                  className={`group relative rounded-lg px-4 py-2.5 text-[13px] font-semibold tracking-wide transition-colors duration-200 ${
                    active
                      ? "text-[#A98216]"
                      : "text-[#1A1A1A] hover:text-[#A98216]"
                  }`}
                >
                  {name}

                  <span
                    className={`absolute bottom-1 left-4 right-4 h-[2px] origin-center rounded-full bg-[#D4AF37] transition-transform duration-300 ${
                      active
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          {/* Right: Wishlist, cart, account */}
          <div className="flex flex-1 items-center justify-end gap-0.5 sm:gap-1 md:flex-none">

            <IconButton
              to="/wishlist"
              label="Wishlist"
              count={wishlistCount}
            >
              <Heart
                size={19}
                strokeWidth={1.8}
                className={
                  wishlistCount > 0
                    ? "fill-[#D4AF37] text-[#A98216]"
                    : ""
                }
              />
            </IconButton>

            <IconButton to="/cart" label="Shopping Cart" count={totalCount}>
              <ShoppingCart size={19} strokeWidth={1.8} />
            </IconButton>

            {/* Desktop account */}
            {currentUser?.uid ? (
              <div
                ref={userMenuRef}
                className="relative hidden md:block"
                onMouseEnter={onProfileEnter}
                onMouseLeave={onProfileLeave}
              >
                <button
                  type="button"
                  onClick={() => setProfileOpen((open) => !open)}
                  aria-label="Open profile menu"
                  aria-expanded={profileOpen}
                  className="flex items-center gap-2 rounded-full border border-[#D4AF37]/40 py-1 pl-1 pr-3 transition-all hover:border-[#D4AF37] hover:bg-[#F7F5EF]"
                >
                  <img
                    src={currentUser.photoURL || avatar}
                    alt="Profile"
                    className="h-8 w-8 rounded-full object-cover ring-2 ring-[#D4AF37]/50"
                    onError={(event) => {
                      event.currentTarget.src = avatar;
                    }}
                  />

                  <span className="max-w-[85px] truncate text-sm font-semibold text-[#123C32]">
                    {profileName}
                  </span>
                  <ChevronRight
                    size={14}
                    className={`text-[#A98216] transition-transform ${
                      profileOpen ? "rotate-90" : ""
                    }`}
                  />
                </button>

                {/* Profile dropdown */}
                <div
                  className={`absolute right-0 top-full mt-3 w-64 origin-top-right overflow-hidden rounded-2xl border border-[#D4AF37]/20 bg-white shadow-[0_16px_50px_rgba(18,60,50,0.16)] transition-all duration-200 ${
                    profileOpen
                      ? "visible translate-y-0 scale-100 opacity-100"
                      : "invisible -translate-y-2 scale-95 opacity-0"
                  }`}
                >
                  <div className="border-b border-[#D4AF37]/20 bg-[#F7F5EF] px-4 py-4">
                    <p className="truncate text-sm font-bold text-[#123C32]">
                      {currentUser.displayName || "User"}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-gray-500">
                      {currentUser.email}
                    </p>
                    <div className="mt-2">
                      <RolePill isAdmin={isAdmin} isStaff={isStaff} />
                    </div>
                  </div>

                  <div className="p-2">
                    <DropItem to="/dashboard" icon={LayoutDashboard} label="My Dashboard" onClick={() => setProfileOpen(false)} />
                    <DropItem to="/profile" icon={User} label="My Profile" onClick={() => setProfileOpen(false)} />
                    <DropItem to="/orders" icon={Package} label="My Orders" onClick={() => setProfileOpen(false)} />
                    <DropItem to="/wishlist" icon={Heart} label="Wishlist" onClick={() => setProfileOpen(false)} />
                    <DropItem to="/settings" icon={Settings} label="Settings" onClick={() => setProfileOpen(false)} />

                    {(isAdmin || isStaff) && (
                      <>
                        <div className="my-2 border-t border-[#D4AF37]/20" />
                        <DropItem
                          to="/admin"
                          icon={Shield}
                          label={isAdmin ? "Admin Panel" : "Staff Panel"}
                          accent
                          onClick={() => setProfileOpen(false)}
                        />
                      </>
                    )}

                    <div className="my-2 border-t border-gray-100" />

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                aria-label="Login"
                className="btn btn-sm hidden min-h-0 rounded-full border border-[#123C32] bg-[#123C32] px-5 text-white shadow-none transition-all hover:border-[#A98216] hover:bg-[#A98216] md:inline-flex"
              >
                Login
              </Link>
            )}

            {/* Mobile account */}
            {currentUser?.uid ? (
              <button
                type="button"
                onClick={() => setMobileProfileOpen(true)}
                aria-label="Open profile"
                className="ml-1 rounded-full p-0.5 ring-2 ring-[#D4AF37]/60 transition hover:ring-[#D4AF37] md:hidden"
              >
                <img
                  src={currentUser.photoURL || avatar}
                  alt="Profile"
                  className="h-8 w-8 rounded-full object-cover"
                  onError={(event) => {
                    event.currentTarget.src = avatar;
                  }}
                />
              </button>
            ) : (
              <Link
                to="/login"
                aria-label="Login"
                className="ml-1 flex h-10 w-10 items-center justify-center rounded-full text-[#123C32] transition hover:bg-[#F7F5EF] hover:text-[#A98216] md:hidden"
              >
                <CircleUser size={21} strokeWidth={1.8} />
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Spacer for fixed navbar */}
      <div
        aria-hidden="true"
        className="w-full flex-shrink-0"
        style={{
          height: navHeight > 0 ? navHeight : "var(--navbar-height, 64px)",
        }}
      />

      {/* ─── MOBILE NAV DRAWER ────────────────────────────────────────── */}
      <div
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 z-[110] bg-[#10251F]/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
        className={`fixed left-0 top-0 z-[120] flex h-full w-[82vw] max-w-[330px] flex-col bg-white shadow-2xl transition-transform duration-300 ease-out md:hidden ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between border-b border-[#D4AF37]/25 bg-[#123C32] px-5 py-5">
          <Link to="/" onClick={() => setMenuOpen(false)}>
            <img src={logo} alt="Anis Abaya" className="h-9 w-auto object-contain" />
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            className="btn btn-ghost btn-circle btn-sm text-white hover:bg-white/10"
          >
            <X size={21} />
          </button>
        </div>

        {/* Drawer links */}
        <nav className="flex-1 overflow-y-auto py-4">
          <p className="mb-2 px-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#A98216]">
            Navigation
          </p>

          {NAV_LINKS.map(({ name, path, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setMenuOpen(false)}
              className={`mx-3 flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-semibold transition-colors ${
                isActive(path)
                  ? "bg-[#F7F5EF] text-[#A98216]"
                  : "text-[#1A1A1A] hover:bg-[#F7F5EF] hover:text-[#123C32]"
              }`}
            >
              <Icon size={18} />
              <span>{name}</span>
              <ChevronRight size={15} className="ml-auto opacity-40" />
            </Link>
          ))}

          {currentUser?.uid && (
            <>
              <div className="mx-5 my-4 border-t border-[#D4AF37]/20" />

              <p className="mb-2 px-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#A98216]">
                My Account
              </p>

              <NavDrawerItem to="/dashboard" icon={LayoutDashboard} label="My Dashboard" onClick={() => setMenuOpen(false)} />
              <NavDrawerItem to="/profile" icon={User} label="My Profile" onClick={() => setMenuOpen(false)} />
              <NavDrawerItem to="/orders" icon={Package} label="My Orders" onClick={() => setMenuOpen(false)} />
              <NavDrawerItem to="/wishlist" icon={Heart} label="Wishlist" badge={wishlistCount} onClick={() => setMenuOpen(false)} />
              <NavDrawerItem to="/settings" icon={Settings} label="Settings" onClick={() => setMenuOpen(false)} />

              {(isAdmin || isStaff) && (
                <NavDrawerItem
                  to="/admin"
                  icon={Shield}
                  label={isAdmin ? "Admin Panel" : "Staff Panel"}
                  accent
                  onClick={() => setMenuOpen(false)}
                />
              )}
            </>
          )}
        </nav>

        {/* Drawer footer */}
        <div className="border-t border-[#D4AF37]/20 p-4">
          {currentUser?.uid ? (
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 py-3.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
            >
              <LogOut size={17} />
              Sign Out
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="btn min-h-0 w-full rounded-xl border-0 bg-[#123C32] py-3.5 text-sm font-semibold text-white shadow-none hover:bg-[#A98216]"
            >
              Login / Sign Up
            </Link>
          )}
        </div>
      </aside>

      {/* ─── MOBILE PROFILE BOTTOM SHEET ───────────────────────────────── */}
      <div
        onClick={() => setMobileProfileOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 z-[110] bg-[#10251F]/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          mobileProfileOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      <section
        aria-label="Account menu"
        aria-hidden={!mobileProfileOpen}
        className={`fixed bottom-0 left-0 right-0 z-[120] max-h-[90vh] overflow-y-auto rounded-t-[28px] border-t border-[#D4AF37]/30 bg-white shadow-2xl transition-transform duration-300 ease-out md:hidden ${
          mobileProfileOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Handle */}
        <div className="flex justify-center pb-2 pt-3">
          <div className="h-1 w-10 rounded-full bg-[#D4AF37]/50" />
        </div>

        {/* User info */}
        <div className="border-b border-[#D4AF37]/20 px-5 pb-5 pt-2">
          <div className="flex items-center gap-4">
            <img
              src={currentUser?.photoURL || avatar}
              alt="Profile"
              className="h-14 w-14 rounded-full border-2 border-[#D4AF37] object-cover p-0.5"
              onError={(event) => {
                event.currentTarget.src = avatar;
              }}
            />

            <div className="min-w-0 flex-1">
              <p className="truncate text-base font-bold text-[#123C32]">
                {currentUser?.displayName || "User"}
              </p>
              <p className="truncate text-xs text-gray-500">
                {currentUser?.email}
              </p>
              <div className="mt-2">
                <RolePill isAdmin={isAdmin} isStaff={isStaff} />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setMobileProfileOpen(false)}
              aria-label="Close profile"
              className="btn btn-ghost btn-circle btn-sm text-gray-500"
            >
              <X size={19} />
            </button>
          </div>

          {/* Quick links */}
          <div className="mt-5 grid grid-cols-3 gap-2">
            <QuickStat
              to="/orders"
              icon={Package}
              label="Orders"
              color="emerald"
              onClick={() => setMobileProfileOpen(false)}
            />
            <QuickStat
              to="/wishlist"
              icon={Heart}
              label="Wishlist"
              count={wishlistCount}
              color="gold"
              onClick={() => setMobileProfileOpen(false)}
            />
            <QuickStat
              to="/cart"
              icon={ShoppingCart}
              label="Cart"
              count={totalCount}
              color="emerald"
              onClick={() => setMobileProfileOpen(false)}
            />
          </div>
        </div>

        {/* Profile links */}
        <div className="py-2">
          <ProfileSheetItem
            to="/dashboard"
            icon={LayoutDashboard}
            label="My Dashboard"
            desc="Overview of your activity"
            onClick={() => setMobileProfileOpen(false)}
          />
          <ProfileSheetItem
            to="/profile"
            icon={User}
            label="My Profile"
            desc="View and edit your information"
            onClick={() => setMobileProfileOpen(false)}
          />
          <ProfileSheetItem
            to="/orders"
            icon={Package}
            label="My Orders"
            desc="Track your purchases"
            onClick={() => setMobileProfileOpen(false)}
          />
          <ProfileSheetItem
            to="/settings"
            icon={Settings}
            label="Settings"
            desc="Account preferences"
            onClick={() => setMobileProfileOpen(false)}
          />

          {(isAdmin || isStaff) && (
            <ProfileSheetItem
              to="/admin"
              icon={Shield}
              label={isAdmin ? "Admin Panel" : "Staff Panel"}
              desc={isAdmin ? "Manage the store" : "Staff tools and orders"}
              accent
              onClick={() => setMobileProfileOpen(false)}
            />
          )}
        </div>

        {/* Sign out */}
        <div className="border-t border-[#D4AF37]/20 px-5 pb-8 pt-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 py-3.5 text-sm font-semibold text-red-600 transition hover:bg-red-100 active:scale-[0.98]"
          >
            <LogOut size={17} />
            Sign Out
          </button>
        </div>
      </section>
    </>
  );
};

// ─── Sub-components ──────────────────────────────────────────────────────

const DropItem = ({ to, icon: Icon, label, accent, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
      accent
        ? "text-[#A98216] hover:bg-[#F7F5EF]"
        : "text-[#333333] hover:bg-[#F7F5EF] hover:text-[#123C32]"
    }`}
  >
    <Icon size={16} className="shrink-0 opacity-80" />
    <span>{label}</span>
    <ChevronRight size={14} className="ml-auto opacity-30" />
  </Link>
);

const NavDrawerItem = ({ to, icon: Icon, label, badge, accent, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`mx-3 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
      accent
        ? "text-[#A98216] hover:bg-[#F7F5EF]"
        : "text-[#333333] hover:bg-[#F7F5EF] hover:text-[#123C32]"
    }`}
  >
    <Icon size={18} className="shrink-0" />
    <span>{label}</span>

    {badge > 0 && (
      <span className="rounded-full bg-[#D4AF37] px-2 py-0.5 text-[10px] font-bold text-[#123C32]">
        {badge > 9 ? "9+" : badge}
      </span>
    )}

    <ChevronRight size={14} className="ml-auto opacity-30" />
  </Link>
);

const ProfileSheetItem = ({ to, icon: Icon, label, desc, accent, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-[#F7F5EF] active:bg-[#F7F5EF]"
  >
    <div
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
        accent ? "bg-amber-100 text-[#A98216]" : "bg-[#F7F5EF] text-[#123C32]"
      }`}
    >
      <Icon size={18} />
    </div>

    <div className="min-w-0 flex-1">
      <p className={`text-sm font-semibold ${accent ? "text-[#A98216]" : "text-[#123C32]"}`}>
        {label}
      </p>
      <p className="truncate text-xs text-gray-500">{desc}</p>
    </div>

    <ChevronRight size={16} className="shrink-0 text-gray-400" />
  </Link>
);

const QuickStat = ({ to, icon: Icon, label, count, color, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="relative flex flex-col items-center gap-1.5 rounded-xl border border-[#D4AF37]/15 bg-[#F7F5EF] py-3 transition hover:border-[#D4AF37]/50"
  >
    <Icon
      size={19}
      className={color === "gold" ? "text-[#A98216]" : "text-[#123C32]"}
    />
    <span className="text-xs font-semibold text-[#333333]">{label}</span>

    {count > 0 && (
      <span className="absolute right-2 top-1 rounded-full bg-[#D4AF37] px-1.5 text-[9px] font-bold text-[#123C32]">
        {count > 9 ? "9+" : count}
      </span>
    )}
  </Link>
);

export default Navbar;
