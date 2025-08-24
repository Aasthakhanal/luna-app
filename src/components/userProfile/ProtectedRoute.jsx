import { Navigate, Outlet, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import AppLayout from "@/Layouts/AppLayout";
import Login from "@/pages/Login";

const ProtectedRoutes = () => {
  const token = Cookies.get("authToken");
  const location = useLocation();

  if (!token) {
    return <Login />;
  }

  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decodedToken.exp < currentTime) {
      Cookies.remove("authToken");
      return <Login />;
    }

    const userRole = decodedToken.role;
    const currentPath = location.pathname;

    if (userRole === "ADMIN") {
      return <Navigate to="/admin/users" replace />;
    }

    if (currentPath.startsWith("/admin")) {
      return <Navigate to="/" replace />;
    }

    return (
      <AppLayout>
        <Outlet context={{ user: decodedToken }} />
      </AppLayout>
    );
  } catch {
    Cookies.remove("authToken");
    return <Login />;
  }
};

export default ProtectedRoutes;
