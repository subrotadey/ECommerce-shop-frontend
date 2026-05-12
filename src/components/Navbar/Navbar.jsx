// ============================================
// components/Navbar/Navbar.jsx — Production Grade
// ============================================

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
  Circle,
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

// ─── tiny helpers ──────────────────────────────────────────────────────────────

const Badge = ({ count }) =>
  count > 0 ? (
    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center shadow-sm leading-none">
      {count > 9 ? "9+" : count}
    </span>
  ) : null;

const RolePill = ({ isAdmin, isStaff }) => {
  if (isAdmin)
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-50 text-red-600 border border-red-200">
        <Crown size={10} /> Admin
      </span>
    );
  if (isStaff)
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-600 border border-blue-200">
        <UserCog size={10} /> Staff
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
      <User size={10} /> Customer
    </span>
  );
};

// ─── nav data ──────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { name: "Home", path: "/", icon: Home },
  { name: "Abaya", path: "/abaya", icon: ShoppingBag },
  { name: "Hijab", path: "/hijab", icon: ShoppingBag },
  { name: "About", path: "/about", icon: Info },
  { name: "Contact", path: "/contact", icon: Phone },
];

// ─── component ─────────────────────────────────────────────────────────────────

const Navbar = () => {
  const { items } = useCart();
  const { wishlistCount } = useWishlist();
  const { currentUser, logOut } = useAuth();
  const { isAdmin, isStaff } = useRole(currentUser?.email);
  const totalCount = items.reduce((s, i) => s + i.qty, 0);

  const navbarRef = useRef(null);
  const userMenuRef = useRef(null);
  const profileDrawerRef = useRef(null);
  const hoverTimeout = useRef(null);

  const [navHeight, setNavHeight] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  // mobile nav drawer (left side)
  const [menuOpen, setMenuOpen] = useState(false);

  // desktop profile dropdown (hover)
  const [profileOpen, setProfileOpen] = useState(false);

  // mobile profile drawer (bottom-sheet style)
  const [mobileProfileOpen, setMobileProfileOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // close both panels on route change
  useEffect(() => {
    setMenuOpen(false);
    setMobileProfileOpen(false);
  }, [location.pathname]);

  // navbar height
  useEffect(() => {
    const update = () => {
      if (navbarRef.current) {
        const h = navbarRef.current.offsetHeight;
        setNavHeight(h);
        document.documentElement.style.setProperty("--navbar-height", `${h}px`);
      }
    };
    update();
    const ro = new ResizeObserver(update);
    if (navbarRef.current) ro.observe(navbarRef.current);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [isScrolled]);

  // scroll — hide on down, reveal on up
  useEffect(() => {
    const HIDE_THRESHOLD = 80; // px scrolled before hiding starts
    const onScroll = () => {
      const currentY = window.scrollY;
      const diff = currentY - lastScrollY.current;

      setIsScrolled(currentY > 8);

      if (currentY < HIDE_THRESHOLD) {
        // always show near the top
        setIsVisible(true);
      } else if (diff > 4) {
        // scrolling DOWN — hide
        setIsVisible(false);
      } else if (diff < -4) {
        // scrolling UP — show
        setIsVisible(true);
      }

      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // lock body scroll
  useEffect(() => {
    const locked = menuOpen || mobileProfileOpen;
    document.body.style.overflow = locked ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, mobileProfileOpen]);

  // click-outside for desktop profile
  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── desktop hover handlers ──────────────────────────────────────────────────

  const onProfileEnter = useCallback(() => {
    clearTimeout(hoverTimeout.current);
    setProfileOpen(true);
  }, []);

  const onProfileLeave = useCallback(() => {
    hoverTimeout.current = setTimeout(() => setProfileOpen(false), 180);
  }, []);

  // ── logout ──────────────────────────────────────────────────────────────────

  const handleLogout = async () => {
    try {
      await logOut();
      setMenuOpen(false);
      setMobileProfileOpen(false);
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // ── theme helpers ────────────────────────────────────────────────────────────

  const iconCls = isScrolled ? "text-gray-700" : "text-white";
  const hoverRing = isScrolled
    ? "hover:bg-gray-100"
    : "hover:bg-white/15";

  // ── render ───────────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── NAV BAR ── */}
      <nav
        ref={navbarRef}
        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        } ${
          isScrolled
            ? "bg-white/96 backdrop-blur-xl shadow-[0_1px_20px_rgba(0,0,0,0.08)] py-3"
            : "bg-amber-500 py-4"
        }`}
        style={{ isolation: "isolate" }}
      >
        <div className="max-w-screen-xl mx-auto w-full px-4 md:px-8 flex items-center justify-between gap-3">

          {/* ── LEFT: hamburger (mobile) + logo ────────────────────────────── */}
          <div className="flex items-center gap-3">
            {/* Hamburger — mobile only, LEFT side */}
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open navigation menu"
              className={`md:hidden p-2 rounded-xl transition-all ${hoverRing} ${iconCls}`}
            >
              <Menu size={22} strokeWidth={2} />
            </button>

          </div>

          {/* CENTER — logo (flex-1 so it fills remaining space and centers) */}
            <div className="flex items-center justify-center text-white">
              <Link to="/">
                <img
                  src={logo}
                  alt="Anis Abaya"
                  className={`h-8 transition-all duration-300 ${
                    isScrolled ? "" : ""
                  }`}
                />
              </Link>
            </div>

          {/* ── CENTER: desktop nav links ───────────────────────────────────── */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ name, path }) => (
              <Link
                key={path}
                to={path}
                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 group ${
                  isScrolled
                    ? "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                    : "text-white/90 hover:text-white hover:bg-white/15"
                } ${
                  location.pathname === path
                    ? isScrolled
                      ? "text-gray-900 bg-gray-100"
                      : "text-white bg-white/20"
                    : ""
                }`}
              >
                {name}
                <span
                  className={`absolute bottom-1 left-4 right-4 h-0.5 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left ${
                    isScrolled ? "bg-amber-500" : "bg-white/60"
                  } ${location.pathname === path ? "scale-x-100" : ""}`}
                />
              </Link>
            ))}
          </div>

          {/* ── RIGHT: icons ────────────────────────────────────────────────── */}
          <div className="flex items-center gap-1">

            {/* Wishlist */}
            <Link
              to="/wishlist"
              title="Wishlist"
              className={`relative p-2.5 rounded-xl transition-all ${hoverRing}`}
            >
              <Heart
                size={20}
                className={`transition-all ${iconCls} ${
                  wishlistCount > 0
                    ? "fill-red-500 text-red-500"
                    : "group-hover:text-red-500"
                }`}
              />
              <Badge count={wishlistCount} />
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              title="Shopping Cart"
              className={`relative p-2.5 rounded-xl transition-all ${hoverRing}`}
            >
              <ShoppingCart size={20} className={iconCls} />
              <Badge count={totalCount} />
            </Link>

            {/* ── Desktop: user avatar / login ── */}
            {currentUser?.uid ? (
              /* HOVER-based profile dropdown */
              <div
                ref={userMenuRef}
                onMouseEnter={onProfileEnter}
                onMouseLeave={onProfileLeave}
                className="hidden md:block relative"
              >
                <button
                  className={`flex items-center gap-2 pl-1 pr-3 py-1 rounded-full transition-all ${hoverRing} ${
                    isScrolled ? "border border-gray-200" : "border border-white/30"
                  }`}
                  aria-label="Profile menu"
                  aria-expanded={profileOpen}
                >
                  <img
                    src={currentUser.photoURL || avatar}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-amber-400/60"
                    onError={(e) => { e.target.src = avatar; }}
                  />
                  <span
                    className={`text-sm font-medium max-w-[80px] truncate ${
                      isScrolled ? "text-gray-800" : "text-white"
                    }`}
                  >
                    {currentUser.displayName?.split(" ")[0] || "You"}
                  </span>
                </button>

                {/* Desktop dropdown */}
                <div
                  className={`absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-200 origin-top-right ${
                    profileOpen
                      ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                      : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                  }`}
                >
                  {/* User card */}
                  <div className="px-4 py-4 bg-gradient-to-br from-amber-50 to-orange-50 border-b border-amber-100">
                    <div className="flex items-center gap-3">
                      {/* <img
                        src={currentUser.photoURL || avatar}
                        alt="Profile"
                        className="w-11 h-11 rounded-full object-cover ring-2 ring-amber-300"
                        onError={(e) => { e.target.src = avatar; }}
                      /> */}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate text-sm">
                          {currentUser.displayName || "User"}
                        </p>
                        {/* <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
                        <div className="mt-1">
                          <RolePill isAdmin={isAdmin} isStaff={isStaff} />
                        </div> */}
                      </div>
                    </div>
                  </div>

                  {/* Menu items */}
                  <div className="py-1.5">
                    <DropItem to="/dashboard" icon={LayoutDashboard} label="My Dashboard" />
                    <DropItem to="/profile" icon={User} label="My Profile" />
                    <DropItem to="/orders" icon={Package} label="My Orders" />
                    <DropItem to="/wishlist" icon={Heart} label="Wishlist" />
                    <DropItem to="/settings" icon={Settings} label="Settings" />

                    {(isAdmin || isStaff) && (
                      <>
                        <div className="my-1 border-t border-gray-100" />
                        <DropItem
                          to="/admin"
                          icon={Shield}
                          label={isAdmin ? "Admin Panel" : "Staff Panel"}
                          accent
                        />
                      </>
                    )}

                    <div className="my-1 border-t border-gray-100" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Login button — desktop */
              <Link
                to="/login"
                className={`hidden md:inline-flex items-center px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  isScrolled
                    ? "text-black"
                    : "text-white"
                }`}
              >
                <CircleUser/>
              </Link>
            )}

            {/* ── Mobile: user avatar (click → profile drawer) ── */}
            {currentUser?.uid ? (
              <button
                onClick={() => setMobileProfileOpen(true)}
                aria-label="Open profile"
                className={`md:hidden p-1.5 rounded-full transition-all ${hoverRing}`}
              >
                <img
                  src={currentUser.photoURL || avatar}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-amber-400/60"
                  onError={(e) => { e.target.src = avatar; }}
                />
              </button>
            ) : (
              <Link
                to="/login"
                className={`md:hidden px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                  isScrolled
                    ? "text-black"
                    : "text-white"
                }`}
              >
                <CircleUser/>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* ── SPACER — keeps content below fixed navbar ── */}
      <div
        aria-hidden="true"
        style={{ height: navHeight > 0 ? navHeight : "var(--navbar-height, 72px)" }}
        className="w-full flex-shrink-0 pointer-events-none"
      />

      {/* ══════════════════════════════════════════════════════════════════════
          MOBILE NAV DRAWER — slides in from LEFT
      ══════════════════════════════════════════════════════════════════════ */}

      {/* Backdrop */}
      <div
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[110] md:hidden transition-opacity duration-300 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer panel */}
      <aside
        className={`fixed top-0 left-0 h-full w-[82vw] max-w-[320px] bg-white z-[120] md:hidden flex flex-col shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-4 bg-amber-500">
          <img src={logo} alt="Anis Abaya" className="h-8 invert" />
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            className="p-2 rounded-xl hover:bg-white/20 text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable content */}
        <nav className="flex-1 overflow-y-auto">
          {/* Main nav links */}
          <div className="pt-3 pb-2">
            <p className="px-5 text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
              Navigation
            </p>
            {NAV_LINKS.map(({ name, path, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 px-5 py-3 text-sm font-medium transition-all ${
                  location.pathname === path
                    ? "bg-amber-50 text-amber-600 border-r-4 border-amber-500"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon size={18} className="opacity-70 flex-shrink-0" />
                {name}
                <ChevronRight size={14} className="ml-auto opacity-30" />
              </Link>
            ))}
          </div>

          {/* Divider */}
          <div className="mx-5 border-t border-gray-100" />

          {/* Account section (logged in) */}
          {currentUser?.uid && (
            <div className="pt-3 pb-2">
              <p className="px-5 text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                Account
              </p>

              <NavDrawerItem
                to="/dashboard"
                icon={LayoutDashboard}
                label="My Dashboard"
                onClick={() => setMenuOpen(false)}
              />
              <NavDrawerItem
                to="/profile"
                icon={User}
                label="My Profile"
                onClick={() => setMenuOpen(false)}
              />
              <NavDrawerItem
                to="/orders"
                icon={Package}
                label="My Orders"
                onClick={() => setMenuOpen(false)}
              />
              <NavDrawerItem
                to="/wishlist"
                icon={Heart}
                label="Wishlist"
                badge={wishlistCount}
                onClick={() => setMenuOpen(false)}
              />
              <NavDrawerItem
                to="/settings"
                icon={Settings}
                label="Settings"
                onClick={() => setMenuOpen(false)}
              />

              {(isAdmin || isStaff) && (
                <>
                  <div className="mx-5 my-2 border-t border-gray-100" />
                  <NavDrawerItem
                    to="/admin"
                    icon={Shield}
                    label={isAdmin ? "Admin Panel" : "Staff Panel"}
                    accent
                    onClick={() => setMenuOpen(false)}
                  />
                </>
              )}
            </div>
          )}
        </nav>

        {/* Drawer footer */}
        <div className="border-t border-gray-100 p-4">
          {currentUser?.uid ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100 transition-colors"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="block w-full text-center py-3 px-4 rounded-xl bg-amber-500 text-white text-sm font-semibold hover:bg-amber-600 transition-colors"
            >
              Login / Sign Up
            </Link>
          )}
        </div>
      </aside>

      {/* ══════════════════════════════════════════════════════════════════════
          MOBILE PROFILE BOTTOM-SHEET
          Opens when user taps their avatar on mobile
      ══════════════════════════════════════════════════════════════════════ */}

      {/* Backdrop */}
      <div
        onClick={() => setMobileProfileOpen(false)}
        className={`fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[110] md:hidden transition-opacity duration-300 ${
          mobileProfileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Bottom-sheet panel */}
      <div
        ref={profileDrawerRef}
        className={`fixed bottom-0 left-0 right-0 z-[120] md:hidden bg-white rounded-t-3xl shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] max-h-[90vh] overflow-y-auto ${
          mobileProfileOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Pull handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>

        {/* User info card */}
        <div className="px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <img
              src={currentUser?.photoURL || avatar}
              alt="Profile"
              className="w-14 h-14 rounded-full object-cover ring-3 ring-amber-400/50 shadow-md"
              onError={(e) => { e.target.src = avatar; }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-base font-bold text-gray-900 truncate">
                {currentUser?.displayName || "User"}
              </p>
              <p className="text-sm text-gray-500 truncate">{currentUser?.email}</p>
              <div className="mt-1.5">
                <RolePill isAdmin={isAdmin} isStaff={isStaff} />
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            <Link
              to="/orders"
              onClick={() => setMobileProfileOpen(false)}
              className="flex flex-col items-center py-2.5 bg-amber-50 rounded-xl"
            >
              <Package size={18} className="text-amber-600 mb-1" />
              <span className="text-xs font-semibold text-gray-700">Orders</span>
            </Link>
            <Link
              to="/wishlist"
              onClick={() => setMobileProfileOpen(false)}
              className="relative flex flex-col items-center py-2.5 bg-red-50 rounded-xl"
            >
              <Heart size={18} className={`mb-1 ${wishlistCount > 0 ? "fill-red-500 text-red-500" : "text-red-500"}`} />
              <span className="text-xs font-semibold text-gray-700">Wishlist</span>
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-3 bg-red-500 text-white text-[9px] font-bold rounded-full px-1 leading-4">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link
              to="/cart"
              onClick={() => setMobileProfileOpen(false)}
              className="relative flex flex-col items-center py-2.5 bg-blue-50 rounded-xl"
            >
              <ShoppingCart size={18} className="text-blue-500 mb-1" />
              <span className="text-xs font-semibold text-gray-700">Cart</span>
              {totalCount > 0 && (
                <span className="absolute top-1 right-3 bg-blue-500 text-white text-[9px] font-bold rounded-full px-1 leading-4">
                  {totalCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Profile links */}
        <div className="py-2">
          <ProfileSheetItem
            to="/dashboard"
            icon={LayoutDashboard}
            label="My Dashboard"
            desc="Overview of your activity"
            iconBg="bg-indigo-100"
            iconColor="text-indigo-600"
            onClick={() => setMobileProfileOpen(false)}
          />
          <ProfileSheetItem
            to="/profile"
            icon={User}
            label="My Profile"
            desc="View & edit your info"
            iconBg="bg-amber-100"
            iconColor="text-amber-600"
            onClick={() => setMobileProfileOpen(false)}
          />
          <ProfileSheetItem
            to="/orders"
            icon={Package}
            label="My Orders"
            desc="Track your purchases"
            iconBg="bg-green-100"
            iconColor="text-green-600"
            onClick={() => setMobileProfileOpen(false)}
          />
          <ProfileSheetItem
            to="/settings"
            icon={Settings}
            label="Settings"
            desc="Notifications, password & more"
            iconBg="bg-gray-100"
            iconColor="text-gray-600"
            onClick={() => setMobileProfileOpen(false)}
          />

          {(isAdmin || isStaff) && (
            <>
              <div className="mx-5 my-1 border-t border-dashed border-purple-200" />
              <ProfileSheetItem
                to="/admin"
                icon={Shield}
                label={isAdmin ? "Admin Panel" : "Staff Panel"}
                desc={isAdmin ? "Manage the store" : "Staff tools & orders"}
                iconBg="bg-purple-100"
                iconColor="text-purple-600"
                accent
                onClick={() => setMobileProfileOpen(false)}
              />
            </>
          )}
        </div>

        {/* Sign out */}
        <div className="px-5 pb-8 pt-2">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-red-50 text-red-600 font-semibold text-sm hover:bg-red-100 active:scale-[0.98] transition-all"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
};

// ─── sub-components ────────────────────────────────────────────────────────────

/** Desktop dropdown item */
const DropItem = ({ to, icon: Icon, label, accent }) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
      accent
        ? "text-purple-700 hover:bg-purple-50"
        : "text-gray-700 hover:bg-gray-50"
    }`}
  >
    <Icon size={15} className="opacity-70 flex-shrink-0" />
    <span>{label}</span>
    <ChevronRight size={13} className="ml-auto opacity-30" />
  </Link>
);

/** Mobile nav drawer item */
const NavDrawerItem = ({ to, icon: Icon, label, badge, accent, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`flex items-center gap-3 px-5 py-3 text-sm font-medium transition-all ${
      accent
        ? "text-purple-700 hover:bg-purple-50"
        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
    }`}
  >
    <Icon size={18} className="opacity-70 flex-shrink-0" />
    <span>{label}</span>
    {badge > 0 && (
      <span className="ml-1 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center">
        {badge > 9 ? "9+" : badge}
      </span>
    )}
    <ChevronRight size={14} className="ml-auto opacity-30" />
  </Link>
);

/** Mobile profile sheet item */
const ProfileSheetItem = ({ to, icon: Icon, label, desc, iconBg, iconColor, accent, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`flex items-center gap-4 px-5 py-3.5 active:bg-gray-50 transition-colors ${
      accent ? "text-purple-700" : "text-gray-900"
    }`}
  >
    <div className={`w-10 h-10 rounded-2xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
      <Icon size={18} className={iconColor} />
    </div>
    <div className="flex-1 min-w-0">
      <p className={`text-sm font-semibold ${accent ? "text-purple-700" : "text-gray-900"}`}>
        {label}
      </p>
      <p className="text-xs text-gray-500 truncate">{desc}</p>
    </div>
    <ChevronRight size={16} className="opacity-30 flex-shrink-0" />
  </Link>
);

export default Navbar;