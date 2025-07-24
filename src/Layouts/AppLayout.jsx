import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useFindUserQuery } from "../app/userApi";
import { useSelector } from "react-redux";

const AppLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const user_id = useSelector((state) => state.auth.user);
  const { data: user, isLoading } = useFindUserQuery(user_id, {
    skip: !user_id,
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  if (isLoading)
    return <div className="min-h-screen bg-secondary p-8">Loading...</div>;

  return (
    <div className="flex h-screen w-screen bg-white">
      <Sidebar isCollapsed={isCollapsed} role={user?.role} />

      <div className="flex-1 flex flex-col overflow-auto">
        <Navbar
          user={user}
          toggleSidebar={toggleSidebar}
          isCollapsed={isCollapsed}
        />

        <div className="p-4 flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
