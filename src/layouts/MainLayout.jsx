// ============================================
//src/layouts/MainLayout.jsx
// ============================================
import { Outlet } from "react-router";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import BackToTop from "../components/Shared/BackToTop/BackToTop";

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <BackToTop />
      <Footer />
    </>
  );
};

export default MainLayout;