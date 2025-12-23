import { createBrowserRouter } from "react-router-dom"; // Use react-router-dom
import RootLayout from "../Layouts/RootLayout";
import Home from "../Page/Home/Home/Home";
import Login from "../Page/Login/Login";
import Dashboard from "../Page/Dashboard/Dashboard";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />, // Use 'element' syntax
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/dashboard",
                element: <Dashboard />,
            },
        ],
    },
]);