// src/hooks/useSidebar.js
import { useState, useEffect, useCallback } from "react";

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
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(collapsed));
    } catch {
      /* storage বন্ধ থাকলে চুপচাপ এড়িয়ে যাই */
    }
  }, [collapsed]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);
  const openMobile = useCallback(() => setMobileOpen(true), []);
  const toggleCollapse = useCallback(() => setCollapsed((p) => !p), []);

  // মেনু খোলা থাকলে: পেছনের পেজ স্ক্রল বন্ধ, Escape-এ বন্ধ, ডেস্কটপ প্রস্থে গেলে বন্ধ
  useEffect(() => {
    if (!mobileOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e) => e.key === "Escape" && setMobileOpen(false);
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = (e) => e.matches && setMobileOpen(false);

    document.addEventListener("keydown", onKey);
    mq.addEventListener("change", onChange);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onChange);
    };
  }, [mobileOpen]);

  return { collapsed, toggleCollapse, mobileOpen, openMobile, closeMobile };
};