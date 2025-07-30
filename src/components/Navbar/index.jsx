import { Search, Bell, Menu } from "lucide-react";
import UserProfile from "../UserProfile";

const Navbar = ({ user, toggleSidebar, setIsAuthenticated }) => {
  return (
    <div className="bg-gradient-to-tr from-white to-red-50  h-16 flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-secondary rounded-lg transition-colors"
        >
          <Menu className="h-5 w-5 text-neutral" />
        </button>
      </div>

      <div className="flex items-center space-x-6">
        {/* Notifications */}
        {/* <button className="relative p-2 hover:bg-accent rounded-full">
          <Bell className="h-5 w-5 text-neutral" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-primary rounded-full"></span>
        </button> */}

        {/* User Profile */}
        <UserProfile user={user} setIsAuthenticated={setIsAuthenticated} />
      </div>
    </div>
  );
};

export default Navbar;
