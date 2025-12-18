// ============================================
// layouts/MainLayout.jsx - CartProvider এখানে
// ============================================
import { Outlet } from "react-router";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import CartProvider from "../contexts/CartProvider";

const MainLayout = () => {
  return (
    <>
      <CartProvider>
        <Navbar />
        <Outlet />
        <Footer />
      </CartProvider>
    </>
  );
};

export default MainLayout;