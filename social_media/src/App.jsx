import { RouterProvider } from "react-router-dom";
import "./index.css";
import router from "./routes/Router";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
