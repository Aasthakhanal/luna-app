import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import Landingpage from "./pages/Landingpage";

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
  const { isAuthenticated } = useSelector((state) => state.auth);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landingpage />}></Route>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
        />
        <Route
          path="/signup"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Signup />}
        />

        {/* Projected Routes */}
        <Route path="/" element={<ProtectedRoutes />}>
          <Route path="/dashboard" element={<Dashboard />}></Route>
        </Route>
      </Routes>
    </Router>
  );
}
export default App;
