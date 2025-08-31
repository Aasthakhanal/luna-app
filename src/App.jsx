import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
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
import Chatbot from "./pages/Chatbot";
import Settings from "./pages/Settings";
import FullCalendarPage from "./pages/FullCalendarPage";
import SignupOTP from "./pages/SignupOTP";
import GynecologistsPage from "./pages/Gynecologists";
import { Toaster } from "sonner";
import { generateToken, messaging } from "./notifications/firebase";
import { onMessage } from "firebase/messaging";
import { useUpdateUserMutation } from "@/app/userApi";
import { useUserDailyCheckMutation } from "@/app/notificationsApi";

function App() {
  const [updateUser] = useUpdateUserMutation();
  const [userDailyCheck] = useUserDailyCheckMutation();
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!Cookies.get("authToken")
  );
  const [userRole, setUserRole] = useState(null);

  const isNewDay = () => {
    const lastCheckDate = localStorage.getItem("lastCycleCheckDate");
    const today = new Date().toDateString();

    if (!lastCheckDate || lastCheckDate !== today) {
      localStorage.setItem("lastCycleCheckDate", today);
      return true;
    }
    return false;
  };

  useEffect(() => {
    const initApp = async () => {
      const token = Cookies.get("authToken");

      if (token) {
        try {
          const decoded = jwtDecode(token);
          setUserRole(decoded.role);
          const userId = decoded.user_id;

          const fcm_token = await generateToken();

          fcm_token && (await updateUser({ id: userId, fcm_token }).unwrap());
          if (decoded.role === "USER" && isNewDay()) {
            try {
              const result = await userDailyCheck().unwrap();
              console.log("User daily check completed:", result);
            } catch (error) {
              console.error("Failed to perform user daily check:", error);
            }
          }

          onMessage(messaging, (payload) => {
            console.log("Message received. ", payload);
          });
        } catch (err) {
          console.error("Token decode failed", err);
          setUserRole(null);
        }
      } else {
        setUserRole(null);
      }
    };

    initApp();
  }, [isAuthenticated, updateUser, userDailyCheck]);

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

          <Route path="/reset-password" element={<ForgotPasswordPage />} />

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
            <Route path="chatbot" element={<Chatbot />} />
            <Route path="settings" element={<Settings />} />
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
