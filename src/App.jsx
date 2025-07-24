import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { Dashboard } from "./pages/Dashboard";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import Landingpage from "./pages/Landingpage";
import Insights from "./pages/Insights";
import Chatbot from "./pages/Chatbot";
import Settings from "./pages/Settings";
import FullCalendarPage from "./pages/FullCalendarPage";
import MyAccount from "@/pages/MyAccount";
import { Toaster } from "sonner";
import ChangePassword from "@/pages/ChangePassword";
import Support from "@/pages/Support";
import GynecologistsPage from "./pages/Gynecologists";
import AddGynecologists from "./pages/admin/AddGynecologists";
import ProtectedRoutes from "./components/userProfile/ProtectedRoute";
import AdminRoutes from "./pages/admin/AdminRoutes";
import  Users  from "./pages/admin/Users";
import Gynecologists from "./pages/admin/Gynecologists";
import SignupOTP from "./pages/SignupOTP";


function App() {
  const token = Cookies.get("authToken");
  const isAuthenticated = token;

  let userRole = null;
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      userRole = decodedToken.role;
    } catch (err) {
      console.error("Token decoding error:", err);
    }
  }

  return (
    <>
      <Toaster richColors position="top-right" />

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
                <Login />
              )
            }
          />
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
                <Signup />
              )
            }
          />

          <Route path="/" element={<ProtectedRoutes />}>
            <Route
              path="dashboard"
              element={
                <Dashboard user={isAuthenticated ? jwtDecode(token) : null} />
              }
            />
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

          <Route path="/admin" element={<AdminRoutes />}>
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
