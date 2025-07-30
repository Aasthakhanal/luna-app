import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { Dashboard } from "./pages/Dashboard";
import Landingpage from "./pages/Landingpage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ProtectedRoutes from "./components/userProfile/ProtectedRoute";
import AdminRoutes from "./pages/admin/AdminRoutes";
import Users from "./pages/admin/Users";
import Gynecologists from "./pages/admin/Gynecologists";
import AddGynecologists from "./pages/admin/AddGynecologists";
import MyAccount from "@/pages/MyAccount";
import ChangePassword from "@/pages/ChangePassword";
import Support from "@/pages/Support";
import Insights from "./pages/Insights";
import Chatbot from "./pages/Chatbot";
import Settings from "./pages/Settings";
import FullCalendarPage from "./pages/FullCalendarPage";
import SignupOTP from "./pages/SignupOTP";
import GynecologistsPage from "./pages/Gynecologists";
import { Toaster, toast } from "sonner";
import { generateToken, messaging } from "./notifications/firebase";
import { onMessage } from "firebase/messaging";


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!Cookies.get("authToken")
  );
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    generateToken();
    onMessage(messaging, (payload) => {
      toast(payload?.notification?.body || "New notification");
    });
  }, []);

  useEffect(() => {
    const token = Cookies.get("authToken");
    if (token) {
      try {
        setUserRole(jwtDecode(token).role);
      } catch (err) {
        console.error("Token decode failed", err);
        setUserRole(null);
      }
    } else {
      setUserRole(null);
    }
  }, [isAuthenticated]);

  return (
    <>
      <Toaster richColors position="top-center" />
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                userRole === "ADMIN" ? (
                  <Navigate to="/admin/users" replace />
                ) : (
                  <Navigate to="/dashboard" replace />
                )
              ) : (
                <Landingpage />
              )
            }
          />

          <Route
            path="/login"
            element={
              isAuthenticated ? (
                userRole === "ADMIN" ? (
                  <Navigate to="/admin/users" replace />
                ) : (
                  <Navigate to="/dashboard" replace />
                )
              ) : (
                <Login setIsAuthenticated={setIsAuthenticated} />
              )
            }
          />

          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          <Route
            path="/signup"
            element={
              isAuthenticated ? (
                userRole === "ADMIN" ? (
                  <Navigate to="/admin/users" replace />
                ) : (
                  <Navigate to="/dashboard" replace />
                )
              ) : (
                <Signup setIsAuthenticated={setIsAuthenticated} />
              )
            }
          />

          {/* User Protected Routes */}
          <Route
            path="/"
            element={<ProtectedRoutes isAuthenticated={isAuthenticated} />}
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="calendar" element={<FullCalendarPage />} />
            <Route path="insights" element={<Insights />} />
            <Route path="chatbot" element={<Chatbot />} />
            <Route path="settings" element={<Settings />} />
            <Route path="my-account" element={<MyAccount />} />
            <Route path="change-password" element={<ChangePassword />} />
            <Route path="support" element={<Support />} />
            <Route path="gynecologists" element={<GynecologistsPage />} />
            <Route path="verifyEmail" element={<SignupOTP />} />
            
          </Route>

          {/* Admin Protected Routes */}
          <Route
            path="/admin"
            element={<AdminRoutes isAuthenticated={isAuthenticated} />}
          >
            <Route path="add-gynecologist" element={<AddGynecologists />} />
            <Route path="gynecologists" element={<Gynecologists />} />
            <Route path="users" element={<Users />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
