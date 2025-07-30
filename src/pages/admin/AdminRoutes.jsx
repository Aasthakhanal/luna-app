import { useNavigate, Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import AppLayout from "../../Layouts/AppLayout";
import { useEffect } from "react";

const AdminRoutes = () => {
  const token = Cookies.get("authToken");
  const navigate = useNavigate();
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  if (!token) {
    return null;
  }

  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decodedToken.exp < currentTime) {
      Cookies.remove("authToken");
      return <Navigate to="/login" />;
    }

    if (decodedToken.role !== "ADMIN") {
      return <Navigate to="/" replace />;
    }

    return (
      <AppLayout>
        <Outlet context={{ user: decodedToken }} />
      </AppLayout>
    );
  } catch {
    Cookies.remove("authToken");
  }
};

export default AdminRoutes;
