import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { useState } from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { Dashboard } from "./pages/Dashboard";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import Landingpage from "./pages/Landingpage";
import Insights from "./pages/Insights";
import Chatbot from "./pages/Chatbot";
import Settings from "./pages/Settings";
import AppLayout from "./Layouts/AppLayout";
import FullCalendarPage from "./pages/FullCalendarPage";
import MyAccount from "@/pages/MyAccount";
import { Toaster } from "sonner";
import ChangePassword from "@/pages/ChangePassword";
import Support from "@/pages/Support";
import GynecologistsPage from "./pages/Gynecologists";
import Admin from "./pages/admin/Admin";
import AddGynecologists from "./pages/admin/AddGynecologists";

const ProtectedRoutes = () => {
  const token = Cookies.get("authToken");
  try {
    const decodedToken = token ? jwtDecode(token) : null;
    const user_id = decodedToken?.user_id;
    if (decodedToken && decodedToken.exp) {
      const currentTime = Date.now() / 1000;
      if (currentTime > decodedToken.exp) {
        Cookies.remove("authToken");
        return <Navigate to="/login" />;
      }
    }
    if (!token || !user_id) {
      Cookies.remove("authToken");
      return <Navigate to="/login" />;
    }
    return <AppLayout />;
  } catch (err) {
    console.error(err);
    Cookies.remove("authToken");
    return <Navigate to="/login" />;
  }
};

const AdminProtectedRoute = ({ user }) => {
  const token = Cookies.get("authToken");
  if (!token) return <Navigate to="/login" />;

  let role;
  try {
    role = user.role;
  } catch {
    return <Navigate to="/login" />;
  }

  if (role !== "ADMIN") {
    return <Navigate to="/dashboard" />;
  } else {
    return <Navigate to="/admin" />;
  }
};
function App() {
  const token = Cookies.get("authToken");
  const isAuthenticated = !!token;

  return (
    <>
      <Toaster richColors position="top-right" />

      <Router>
        <Routes>
          <Route
            path="/"
            element={<Landingpage isAuthenticated={isAuthenticated} />}
          />
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
          />
          <Route
            path="/signup"
            element={
              isAuthenticated ? <Navigate to="/dashboard" /> : <Signup />
            }
          />

          {/* Protected routes wrapper */}
          <Route
            path="/"
            element={
              <ProtectedRoutes
                user={isAuthenticated ? jwtDecode(token) : null}
              />
            }
          >
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

            {/* Admin protected routes */}
            <Route
              path="admin"
              element={
                <AdminProtectedRoute
                  user={isAuthenticated ? jwtDecode(token) : null}
                />
              }
            >
              <Route index element={<Admin />} />
              <Route path="add-gynecologist" element={<AddGynecologists />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
