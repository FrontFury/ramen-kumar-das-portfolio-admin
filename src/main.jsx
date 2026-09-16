import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/router";
import "./index.css";
import AuthProvider from "./context/AuthContext/AuthProvider";
import { Toaster } from "react-hot-toast"; 
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";


const queryClient = new QueryClient()

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider  client={queryClient}>
      <AuthProvider>
      <Toaster 
        position="top-center" 
        reverseOrder={false} 
        toastOptions={{ duration: 3000 }} 
      />
      <RouterProvider router={router} />
    </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);