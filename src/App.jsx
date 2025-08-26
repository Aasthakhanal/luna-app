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
import MyAccount from "@/pages/MyAccount";
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
import { useUpdateUserMutation } from "@/app/userApi";
import { useUserDailyCheckMutation } from "@/app/notificationsApi";

function App() {
  const [updateUser] = useUpdateUserMutation();
  const [userDailyCheck] = useUserDailyCheckMutation();
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!Cookies.get("authToken")
  );
  const [userRole, setUserRole] = useState(null);

  // Helper function to check if it's a new day
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

          // Trigger daily cycle check only for regular users (not admins) and only once per day
          if (decoded.role === "USER" && isNewDay()) {
            try {
              const result = await userDailyCheck().unwrap();
              console.log("User daily check completed:", result);

              // Show toast notifications sequentially with 5-second delays
              if (result.notifications && result.notifications.length > 0) {
                result.notifications.forEach((notification, index) => {
                  setTimeout(() => {
                    toast(
                      <div className="flex items-center gap-3 p-3 w-full max-w-sm">
                        <div className="relative flex-shrink-0">
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">•</span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0 overflow-hidden">
                          <div className="font-semibold text-gray-800 text-sm mb-1 truncate max-w-[200px]">
                            {notification.title}
                          </div>
                          <div className="text-gray-600 text-xs leading-tight line-clamp-2 max-w-[200px]">
                            {notification.body}
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <div className="w-2 h-2 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full animate-pulse"></div>
                        </div>
                      </div>,
                      {
                        duration: 4000, // Shorter duration to prevent overlap
                        position: "top-center",
                        style: {
                          background:
                            "linear-gradient(135deg, #fef7f7 0%, #fef2f2 100%)",
                          border: "1px solid #fecaca",
                          borderRadius: "12px",
                          boxShadow:
                            "0 10px 25px -5px rgba(251, 113, 133, 0.25), 0 4px 6px -2px rgba(251, 113, 133, 0.05)",
                          width: "320px",
                          height: "80px",
                          minHeight: "80px",
                          maxHeight: "80px",
                        },
                        className: "border-l-4 border-l-rose-400",
                      }
                    );
                  }, index * 4500); // 4.5-second delay between each notification
                });
              }
            } catch (error) {
              console.error("Failed to perform user daily check:", error);
            }
          }

          onMessage(messaging, (payload) => {
            toast(
              <div className="flex items-center gap-3 p-3 w-full max-w-sm">
                <div className="relative flex-shrink-0">
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">🔔</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0 overflow-hidden">
                  <div className="font-semibold text-gray-800 text-sm mb-1 truncate max-w-[200px]">
                    {payload?.notification?.title || "Luna Notification"}
                  </div>
                  <div className="text-gray-600 text-xs leading-tight line-clamp-2 max-w-[200px]">
                    {payload?.notification?.body || "New notification"}
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full animate-pulse"></div>
                </div>
              </div>,
              {
                duration: 4000,
                position: "top-center",
                style: {
                  background:
                    "linear-gradient(135deg, #fef7f7 0%, #fef2f2 100%)",
                  border: "1px solid #fecaca",
                  borderRadius: "12px",
                  boxShadow:
                    "0 10px 25px -5px rgba(251, 113, 133, 0.25), 0 4px 6px -2px rgba(251, 113, 133, 0.05)",
                  width: "320px",
                  height: "80px",
                  minHeight: "80px",
                  maxHeight: "80px",
                },
                className: "border-l-4 border-l-rose-400",
              }
            );
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
