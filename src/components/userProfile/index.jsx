import { useState } from "react";
import avatar from "../../assets/avatar.avif";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { UserCheck, LockKeyholeOpen, Headphones, LogOut } from "lucide-react";
import { logout } from "@/features/auth/authSlice";

const UserProfile = ({ user }) => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.clear();
    navigate("/");
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <div className="flex items-center space-x-3 cursor-pointer select-none">
          <img
            src={avatar}
            alt={user?.name ? `${user.name}'s avatar` : "User avatar"}
            className="h-10 w-10 rounded-full object-cover"
          />
          <div className="flex flex-col">
            <p className="font-medium text-neutral-900">
              {user?.name || "User Name"}
            </p>
            <p className="text-neutral-500 text-xs">{user?.role || "Admin"}</p>
          </div>
        </div>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-[320px] bg-gradient-to-br from-red-200 to-pink-50 shadow-lg p-6 flex flex-col"
      >
        <SheetHeader className="w-[320px] p-6 flex flex-col items-center">
          <img
            src={avatar}
            alt="user avatar"
            className="h-20 w-20 rounded-full object-cover"
          />
          <SheetTitle className="text-xl font-semibold flex items-center gap-2">
            User Profile
          </SheetTitle>
          <SheetDescription className="text-sm text-gray-600">
            Manage your account and settings
          </SheetDescription>
        </SheetHeader>

        <nav className="mt-6 flex flex-col gap-4 text-gray-700 text-base">
          <button
            onClick={() => {
              navigate("/change-password");
              setOpen(false);
            }}
            className="w-full text-left px-4 py-2 rounded hover:bg-pink-50 transition flex items-center gap-2"
          >
            <LockKeyholeOpen className="h-4 w-4" />
            Change Password
          </button>
          <button
            onClick={() => {
              navigate("/support");
              setOpen(false);
            }}
            className="w-full text-left px-4 py-2 rounded hover:bg-pink-50 transition flex items-center gap-2"
          >
            <Headphones className="h-4 w-4" />
            Support
          </button>

          <hr className="my-4 border-pink-200" />

          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 rounded text-red-600 hover:bg-red-100 transition flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default UserProfile;
