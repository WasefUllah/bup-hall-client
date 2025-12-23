import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/router.jsx";
import AuthProvider from "./providers/AuthProvider"; // Import the provider

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <AuthProvider>  {/* WRAP HERE */}
            <RouterProvider router={router} />
        </AuthProvider> {/* WRAP HERE */}
    </StrictMode>
);
