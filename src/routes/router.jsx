import { createBrowserRouter } from "react-router-dom"; // Use react-router-dom
import RootLayout from "../Layouts/RootLayout";
import Home from "../Page/Home/Home/Home";
import Login from "../Page/Login/Login";
import Dashboard from "../Page/Dashboard/Dashboard";
import SignUp from "../Page/SignUp/SignUp"; // <--- Import SignUp
import AdminDashboard from "../Page/AdminDashboard/AdminDashboard"; // <--- Import this
import HallSeatApplicationForm from "../Page/Dashboard/HallSeatApplicationForm";
import StudentProfile from "../Page/Dashboard/StudentProfile";
import PrivateRoute from "./PrivateRoute";


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
                path: "/hallSeatApplication",
                element: <PrivateRoute><HallSeatApplicationForm /></PrivateRoute>,
            },
            {
                path: "/studentProfile",
                element: <PrivateRoute><StudentProfile /></PrivateRoute>, // PROTECTED
            },
            { path: "/signup", element: <SignUp /> },
            {
                path: "/dashboard",
                element: <PrivateRoute><Dashboard /></PrivateRoute>, // PROTECTED
            },
            { path: "/admin", element: <PrivateRoute><AdminDashboard /></PrivateRoute> }, // <--- Add this
        ],
    },
]);