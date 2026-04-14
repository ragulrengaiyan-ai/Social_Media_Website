import { createBrowserRouter } from "react-router-dom";
import MainRoutes from "./MainRoutes";
import AuthRoutes from "./AuthRoutes";

const router = createBrowserRouter([AuthRoutes, MainRoutes]);

export default router;
