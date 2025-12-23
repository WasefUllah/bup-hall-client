import { createBrowserRouter } from "react-router-dom"; // Use react-router-dom
import RootLayout from "../Layouts/RootLayout";
import Home from "../Page/Home/Home/Home";
import Login from "../Page/Login/Login";
import Dashboard from "../Page/Dashboard/Dashboard";
import SignUp from "../Page/SignUp/SignUp"; // <--- Import SignUp
import AdminDashboard from "../Page/AdminDashboard/AdminDashboard"; // <--- Import this
import HallSeatApplicationForm from "../Page/Dashboard/HallSeatApplicationForm";
import StudentProfile from "../Page/Dashboard/StudentProfile";


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
                element: <HallSeatApplicationForm />,
            },
            {
                path: "/studentProfile",
                element: <StudentProfile />,
            },
            { path: "/signup", element: <SignUp /> },
            {
                path: "/dashboard",
                element: <Dashboard />,
            },
            { path: "/admin", element: <AdminDashboard /> }, // <--- Add this
        ],
    },
]);