// ============================================
// Routes/AppRoutes.jsx
// ============================================
import { createBrowserRouter } from "react-router";
import MainLayout from "../layouts/MainLayout";
import DisplayError from "../components/Shared/DisplayError/DisplayError";
import Home from "../pages/Home/Home";
import SignUp from "../pages/Authentication/SignUp/SignUp";
import Login from "../pages/Authentication/Login/Login";
import ForgetPassword from "../pages/Authentication/ForgetPassword/ForgetPassword";
import AboutUs from "../pages/AboutUs/AboutUs";
import Contact from "../pages/Contact/Contact";
import Cart from "../pages/Cart/Cart";
import ProductDetails from "../pages/ProductDetails/ProductDetails";
import NotFound from "../pages/NotFound/NotFound";
import AbayaAll from "../pages/AbayaAll/AbayaAll";
import HijabAll from "../pages/HijabAll/HijabAll";
import Checkout from "../pages/Checkout/Checkout";
import DashboardLayout from "../layouts/DashboardLayout";
import UserDashboard from "../pages/Dashboard/UserDashboard/UserDashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <DisplayError />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
      {
        path: "/forgetpassword",
        element: <ForgetPassword />,
      },
      {
        path: "/about",
        element: <AboutUs />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/cart",
        element: <Cart />
      },
      {
        path: "abaya",
        element: <AbayaAll />
      },
      {
        path: "hijab",
        element: <HijabAll />
      },
      {
        path: "product/:productId",
        element: <ProductDetails />,
      },
      {
        path: "/checkout",
        element: <Checkout />
      }
    ],
  },
  {
    path: "/dashboard",
    element: <DashboardLayout/>,
    errorElement: <DisplayError />,
    children: [
      {
        index: true,
        element: <UserDashboard />,
      },
      // ... other dashboard routes
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;