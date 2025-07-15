import { useNavigate, useLocation } from "react-router-dom";
import menuItems from "./menuItems";
import logo from '../../assets/lunaa.png'

const Sidebar = ({ isCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div
      className={`${
        isCollapsed ? "w-16" : "w-50"
      } min-h-screen bg-gradient-to-b from-white to-red-50  border-r max-md:w-16 border-accent-dark transition-all duration-300 ease-in-out`}
    >
      {/* Header */}
      <img
        src={logo}
        alt="Logo"
        className={`transition-all duration-300  ${
          isCollapsed ? "h-15 w-15" : "h-35 w-35"
        }`}
        onClick={() => navigate("/dashboard")}
      />

      {/* Menu Items */}
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <li key={item.path}>
                <button
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center p-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary text-white"
                      : "text-neutral hover:bg-secondary"
                  }`}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="hidden md:inline ml-3">{item.label}</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
