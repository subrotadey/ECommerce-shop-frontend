// src/hooks/useSidebar.js
import { useState, useEffect } from "react";

const STORAGE_KEY = "admin_sidebar_collapsed";

export const useSidebar = () => {
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? false;
    } catch {
      return false;
    }
  });

  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(collapsed));
  }, [collapsed]);

  // close mobile on route change
  const closeMobile = () => setMobileOpen(false);

  return {
    collapsed,
    toggleCollapse: () => setCollapsed((p) => !p),
    mobileOpen,
    openMobile: () => setMobileOpen(true),
    closeMobile,
  };
};