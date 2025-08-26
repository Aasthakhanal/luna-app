import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/lunaa.png";
import {
  LayoutDashboard,
  Calendar,
  BotMessageSquare,
  Settings,
  Bell,
} from "lucide-react";

const Sidebar = ({ isCollapsed, role }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const userItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Calendar",
      path: "/calendar",
      icon: Calendar,
    },
    {
      label: "Chatbot",
      path: "/chatbot",
      icon: BotMessageSquare,
    },
    {
      label: "Settings",
      path: "/settings",
      icon: Settings,
    },
  ];

  const adminItems = [
    {
      label: "Users",
      path: "/admin/users",
      icon: LayoutDashboard,
    },
    {
      label: "Gynecologist",
      path: "/admin/gynecologists",
      icon: Calendar,
    },
  ];

  const sidebarItems = role === "ADMIN" ? adminItems : userItems;

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
          {sidebarItems.map((item) => {
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
