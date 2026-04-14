import Dashboard from "../pages/Dashboard";
import Explore from "../pages/Explore";
import AITools from "../pages/AITools";
import Profile from "../pages/Profile";
import Settings from "../pages/Settings";
import MainLayout from "../layouts/MainLayout";
import { Navigate } from "react-router-dom";

const MainRoutes = {
  path: "/",
  element: <MainLayout />,
  children: [
    {
      index: true,
      element: <Navigate to="/dashboard" replace />,
    },
    {
      path: "dashboard",
      element: <Dashboard />,
    },
    {
      path: "explore",
      element: <Explore />,
    },
    {
      path: "ai-tools",
      element: <AITools />,
    },
    {
      path: "profile",
      element: <Profile />,
    },
    {
      path: "settings",
      element: <Settings />,
    },
  ],
};

export default MainRoutes;
