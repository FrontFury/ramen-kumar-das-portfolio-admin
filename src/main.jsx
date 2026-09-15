import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/router";
import "./index.css";
import AuthProvider from "./context/AuthContext/AuthProvider";
import { Toaster } from "react-hot-toast"; // 👈 Toaster Import

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <Toaster 
        position="top-center" 
        reverseOrder={false} 
        toastOptions={{ duration: 3000 }} 
      />
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);