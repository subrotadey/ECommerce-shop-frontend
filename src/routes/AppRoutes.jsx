// Routes/AppRoutes.jsx - PROTECTED ROUTES
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
import Wishlist from "../pages/Wishlist/Wishlist";
import AdminLayout from "../layouts/AdminLayout";
import DashboardHome from "../pages/Dashboard/Admin/DashboardHome/DashboardHome";
import Products from "../pages/Dashboard/Admin/Products/Products";
import Orders from "../pages/Dashboard/Admin/Orders/Orders";
import Customers from "../pages/Dashboard/Admin/Customers/Customers";
import Analytics from "../pages/Dashboard/Admin/Analytics/Analytics";
import Categories from "../pages/Dashboard/Admin/Categories/Categories";
import Coupons from "../pages/Dashboard/Admin/Coupons/Coupons";
import Reviews from "../pages/Dashboard/Admin/Reviews/Reviews";
import Staff from "../pages/Dashboard/Admin/Staff/Staff";
import Settings from "../pages/Dashboard/Admin/Settings/Settings";

// Import Route Guards
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";
import StaffRoute from "./StaffRoute";

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
        path: "/product/:id",
        element: <ProductDetails />,
      },
      {
        path: "/checkout",
        element: (
          <PrivateRoute>
            <Checkout />
          </PrivateRoute>
        )
      },
      {
        path: "/wishlist",
        element: (
          <PrivateRoute>
            <Wishlist />
          </PrivateRoute>
        )
      },
      {
        path: "/profile",
        element: (
          <PrivateRoute>
            {/* Profile page component যুক্ত করুন */}
            <div className="min-h-screen flex items-center justify-center">
              <h1>User Profile Page</h1>
            </div>
          </PrivateRoute>
        )
      },
      {
        path: "/settings",
        element: (
          <PrivateRoute>
            {/* Settings page component যুক্ত করুন */}
            <div className="min-h-screen flex items-center justify-center">
              <h1>Settings Page</h1>
            </div>
          </PrivateRoute>
        )
      }
    ],
  },
  {
    path: "/admin",
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    errorElement: <DisplayError />,
    children: [
      {
        index: true,
        element: <DashboardHome />,
      },
      {
        path: "products",
        element: <Products />
      },
      {
        path: "orders",
        element: <Orders />
      },
      {
        path: "customers",
        element: <Customers />
      },
      {
        path: "analytics",
        element: <Analytics />
      },
      {
        path: "categories",
        element: <Categories />
      },
      {
        path: "coupons",
        element: <Coupons />
      },
      {
        path: "reviews",
        element: <Reviews />
      },
      {
        path: "staff",
        element: <Staff />
      },
      {
        path: "settings",
        element: <Settings />
      }
    ],
  },

  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;