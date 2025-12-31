import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { RouterProvider } from "react-router";
import AuthProvider from "./contexts/AuthContext/AuthProvider";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import router from "./routes/AppRoutes";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router}>
          {/* App components rendered inside router + cart + auth */}
        </RouterProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
