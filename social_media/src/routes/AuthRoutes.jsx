import AuthLayout from "../layouts/AuthLayout";
import SignIn from "../pages/SignIn";
import Register from "../pages/Register";

const AuthRoutes = {
    path: "/",
    element: <AuthLayout />,
    children: [
        {
            path: "login",
            element: <SignIn />,
        },
        {
            path: "signin",
            element: <SignIn />,
        },
        {
            path: "register",
            element: <Register />,
        },
    ],
};

export default AuthRoutes;
