import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import AppLayout from "../../Layouts/AppLayout";
import Login from "../Login";

const AdminRoutes = () => {
  const token = Cookies.get("authToken");
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
