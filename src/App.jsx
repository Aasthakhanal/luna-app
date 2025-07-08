import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
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
import { Toaster } from "sonner";

const ProtectedRoutes = () => {
  const token = Cookies.get("authToken");
  try {
    const decodedToken = token ? jwtDecode(token) : null;
    const user_id = decodedToken?.user_id;
    if (decodedToken && decodedToken.exp) {
      const currentTime = Date.now() / 1000;
      if (currentTime > decodedToken?.exp) {
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
          ></Route>
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

          {/* Projected Routes */}
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
          </Route>
        </Routes>
      </Router>
    </>
  );
}
export default App;
