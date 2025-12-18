import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { RouterProvider } from "react-router";
import router from "./Routes/AppRoutes";
import AuthProvider from "./contexts/AuthContext/AuthProvider";
import CartProvider from "./contexts/CartProvider";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router}>
          {/* <CartProvider> */}
          {/* App components rendered inside router + cart + auth */}
          {/* </CartProvider> */}
        </RouterProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
